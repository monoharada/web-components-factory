import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CHANNEL_CACHE_PATH_ENV,
  CHANNEL_DELEGATED_ENV,
  getDefaultChannelCachePath,
  normalizeChannel,
  resolveStablePackageSpec,
  runDelegatedChannel,
  stripChannelArgs,
  STABLE_REPO_URL,
  validateStableLockDocument,
} from '../scripts/wcf/channel.js';

async function makeTempDir() {
  return mkdtemp(path.join(os.tmpdir(), 'wcf-channel-'));
}

function makeLock(sha: string) {
  return {
    version: 1,
    updatedAt: '2026-02-11T00:00:00.000Z',
    channels: {
      stable: {
        repo: STABLE_REPO_URL,
        sha,
      },
    },
  };
}

let tempDirs: string[] = [];
afterEach(async () => {
  for (const dir of tempDirs) {
    await rm(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe('channel helpers', () => {
  it('normalizes channel values and rejects invalid input', () => {
    expect(normalizeChannel(undefined)).toBe('local');
    expect(normalizeChannel(' stable ')).toBe('stable');
    expect(() => normalizeChannel('latest')).toThrow(/Invalid --channel/);
  });

  it('strips channel args from forwarded argv', () => {
    expect(stripChannelArgs(['blocks', 'list', '--channel=stable'])).toEqual(['blocks', 'list']);
    expect(stripChannelArgs(['vendor', 'install', '--channel', 'stable', '--prefix', 'myui'])).toEqual([
      'vendor',
      'install',
      '--prefix',
      'myui',
    ]);
  });

  it('resolves default cache path for each platform', () => {
    expect(
      getDefaultChannelCachePath({
        platform: 'darwin',
        homedir: '/Users/test',
        env: {},
      }),
    ).toBe('/Users/test/Library/Caches/wcf/channel-cache.json');

    expect(
      getDefaultChannelCachePath({
        platform: 'linux',
        homedir: '/home/test',
        env: {},
      }),
    ).toBe('/home/test/.cache/wcf/channel-cache.json');

    expect(
      getDefaultChannelCachePath({
        platform: 'linux',
        homedir: '/home/test',
        env: { XDG_CACHE_HOME: '/tmp/xdg-cache' },
      }),
    ).toBe('/tmp/xdg-cache/wcf/channel-cache.json');

    expect(
      getDefaultChannelCachePath({
        platform: 'win32',
        homedir: 'C:\\Users\\test',
        env: { LOCALAPPDATA: 'C:\\Users\\test\\AppData\\Local' },
      }),
    ).toContain('wcf/channel-cache.json');
  });
});

describe('resolveStablePackageSpec', () => {
  it('uses fresh cache without fetching lock', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    const nowMs = Date.parse('2026-02-11T01:00:00.000Z');
    const sha = '1111111111111111111111111111111111111111';
    await writeFile(
      cachePath,
      `${JSON.stringify(
        {
          version: 1,
          stable: {
            spec: `git+${STABLE_REPO_URL}#${sha}`,
            sha,
            resolvedAt: '2026-02-11T00:59:00.000Z',
            checkedAt: '2026-02-11T00:59:30.000Z',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const fetchImpl = vi.fn(async () => {
      throw new Error('fetch should not be called');
    });

    const resolved = await resolveStablePackageSpec({
      cachePath,
      fetchImpl,
      nowMs,
    });

    expect(resolved.source).toBe('cache');
    expect(resolved.sha).toBe(sha);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('refreshes stale cache from lock endpoint', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    await writeFile(
      cachePath,
      `${JSON.stringify(
        {
          version: 1,
          stable: {
            spec: `git+${STABLE_REPO_URL}#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
            sha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            resolvedAt: '2026-02-11T00:00:00.000Z',
            checkedAt: '2026-02-10T23:40:00.000Z',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const nextSha = '2222222222222222222222222222222222222222';
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      async json() {
        return makeLock(nextSha);
      },
    }));

    const resolved = await resolveStablePackageSpec({
      cachePath,
      fetchImpl,
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('remote');
    expect(resolved.sha).toBe(nextSha);

    const saved = JSON.parse(await readFile(cachePath, 'utf8'));
    expect(saved.stable.sha).toBe(nextSha);
  });

  it('falls back to stale cache when lock fetch fails', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    const sha = '3333333333333333333333333333333333333333';
    await writeFile(
      cachePath,
      `${JSON.stringify(
        {
          version: 1,
          stable: {
            spec: `git+${STABLE_REPO_URL}#${sha}`,
            sha,
            resolvedAt: '2026-02-11T00:00:00.000Z',
            checkedAt: '2026-02-10T23:00:00.000Z',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const fetchImpl = vi.fn(async () => {
      throw new Error('network unavailable');
    });

    const resolved = await resolveStablePackageSpec({
      cachePath,
      bundledLockPath: path.join(tmp, 'missing-lock.json'),
      fetchImpl,
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('fallback-cache');
    expect(resolved.sha).toBe(sha);
    expect(resolved.warnings.join('\n')).toContain('E_CHANNEL_LOCK_FETCH_FAILED');
  });

  it('prefers stale cache over bundled lock when lock fetch fails', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    const bundledLockPath = path.join(tmp, 'wcf-channel-lock.json');
    const cacheSha = 'abababababababababababababababababababab';
    const bundledSha = 'cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd';
    await writeFile(
      cachePath,
      `${JSON.stringify(
        {
          version: 1,
          stable: {
            spec: `git+${STABLE_REPO_URL}#${cacheSha}`,
            sha: cacheSha,
            resolvedAt: '2026-02-11T00:00:00.000Z',
            checkedAt: '2026-02-10T23:00:00.000Z',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
    await writeFile(bundledLockPath, `${JSON.stringify(makeLock(bundledSha), null, 2)}\n`, 'utf8');

    const resolved = await resolveStablePackageSpec({
      cachePath,
      bundledLockPath,
      fetchImpl: async () => {
        throw new Error('network unavailable');
      },
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('fallback-cache');
    expect(resolved.sha).toBe(cacheSha);
  });

  it('throws E_CHANNEL_RESOLVE_FAILED when lock fetch fails and cache is missing', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');

    await expect(
      resolveStablePackageSpec({
        cachePath,
        bundledLockPath: path.join(tmp, 'missing-lock.json'),
        fetchImpl: async () => {
          throw new Error('network unavailable');
        },
      }),
    ).rejects.toMatchObject({ code: 'E_CHANNEL_RESOLVE_FAILED' });
  });

  it('falls back to bundled lock when lock fetch fails without cache', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    const bundledLockPath = path.join(tmp, 'wcf-channel-lock.json');
    const sha = '1212121212121212121212121212121212121212';
    await writeFile(bundledLockPath, `${JSON.stringify(makeLock(sha), null, 2)}\n`, 'utf8');

    const resolved = await resolveStablePackageSpec({
      cachePath,
      bundledLockPath,
      fetchImpl: async () => {
        throw new Error('network unavailable');
      },
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('bundled-lock');
    expect(resolved.sha).toBe(sha);
    expect(resolved.warnings.join('\n')).toContain('E_CHANNEL_LOCK_FETCH_FAILED');
  });

  it('continues with remote resolution when cache JSON is broken', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    await writeFile(cachePath, '{broken json', 'utf8');

    const sha = '4444444444444444444444444444444444444444';
    const resolved = await resolveStablePackageSpec({
      cachePath,
      fetchImpl: async () => ({
        ok: true,
        async json() {
          return makeLock(sha);
        },
      }),
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('remote');
    expect(resolved.warnings.join('\n')).toContain('E_CHANNEL_CACHE_INVALID');
  });

  it('continues with remote resolution when cache path is unreadable', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    await writeFile(cachePath, 'placeholder', 'utf8');
    await chmod(cachePath, 0o200);

    const sha = '6666666666666666666666666666666666666666';
    const resolved = await resolveStablePackageSpec({
      cachePath,
      fetchImpl: async () => ({
        ok: true,
        async json() {
          return makeLock(sha);
        },
      }),
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('remote');
    expect(resolved.warnings.join('\n')).toContain('E_CHANNEL_CACHE_INVALID');
  });

  it('ignores invalid cache schema and refreshes from remote', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    await writeFile(
      cachePath,
      `${JSON.stringify(
        {
          version: 1,
          stable: null,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const sha = '7777777777777777777777777777777777777777';
    const resolved = await resolveStablePackageSpec({
      cachePath,
      fetchImpl: async () => ({
        ok: true,
        async json() {
          return makeLock(sha);
        },
      }),
      nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
    });

    expect(resolved.source).toBe('remote');
    expect(resolved.sha).toBe(sha);
  });

  it('marks cache invalid when sha/spec/checkedAt are malformed', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    const cases = [
      {
        stable: {
          spec: `git+${STABLE_REPO_URL}#bad`,
          sha: 'bad',
          resolvedAt: '2026-02-11T00:00:00.000Z',
          checkedAt: '2026-02-11T00:00:00.000Z',
        },
        expected: 'Cache sha is invalid',
      },
      {
        stable: {
          spec: `git+${STABLE_REPO_URL}#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
          sha: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          resolvedAt: '2026-02-11T00:00:00.000Z',
          checkedAt: '2026-02-11T00:00:00.000Z',
        },
        expected: 'Cache package spec is invalid',
      },
      {
        stable: {
          spec: `git+${STABLE_REPO_URL}#cccccccccccccccccccccccccccccccccccccccc`,
          sha: 'cccccccccccccccccccccccccccccccccccccccc',
          resolvedAt: '2026-02-11T00:00:00.000Z',
          checkedAt: 'not-date',
        },
        expected: 'Cache checkedAt is invalid',
      },
    ] as const;

    for (const item of cases) {
      await writeFile(
        cachePath,
        `${JSON.stringify(
          {
            version: 1,
            stable: item.stable,
          },
          null,
          2,
        )}\n`,
        'utf8',
      );

      const resolved = await resolveStablePackageSpec({
        cachePath,
        fetchImpl: async () => ({
          ok: true,
          async json() {
            return makeLock('8888888888888888888888888888888888888888');
          },
        }),
        nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
      });

      expect(resolved.source).toBe('remote');
      expect(resolved.warnings.join('\n')).toContain(item.expected);
    }
  });

  it('fails closed when lock payload is invalid even when stale cache exists', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');
    const sha = '9999999999999999999999999999999999999999';
    await writeFile(
      cachePath,
      `${JSON.stringify(
        {
          version: 1,
          stable: {
            spec: `git+${STABLE_REPO_URL}#${sha}`,
            sha,
            resolvedAt: '2026-02-11T00:00:00.000Z',
            checkedAt: '2026-02-10T23:00:00.000Z',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await expect(
      resolveStablePackageSpec({
        cachePath,
        fetchImpl: async () => ({
          ok: true,
          async json() {
            return {
              channels: {
                stable: {
                  repo: 'https://example.com/bad.git',
                  sha: 'abc',
                },
              },
            };
          },
        }),
        nowMs: Date.parse('2026-02-11T01:00:00.000Z'),
      }),
    ).rejects.toMatchObject({ code: 'E_CHANNEL_LOCK_INVALID' });
  });

  it('fails when lock endpoint returns non-ok status without cache', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');

    await expect(
      resolveStablePackageSpec({
        cachePath,
        bundledLockPath: path.join(tmp, 'missing-lock.json'),
        fetchImpl: async () => ({
          ok: false,
          status: 503,
        }),
      }),
    ).rejects.toMatchObject({ code: 'E_CHANNEL_RESOLVE_FAILED' });
  });

  it('fails when lock json parsing throws without cache', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');

    await expect(
      resolveStablePackageSpec({
        cachePath,
        bundledLockPath: path.join(tmp, 'missing-lock.json'),
        fetchImpl: async () => ({
          ok: true,
          async json() {
            throw 'broken-json';
          },
        }),
      }),
    ).rejects.toMatchObject({ code: 'E_CHANNEL_LOCK_INVALID' });
  });

  it('throws lock fetch error when fetch implementation is unavailable', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');

    await expect(
      resolveStablePackageSpec({
        cachePath,
        bundledLockPath: path.join(tmp, 'missing-lock.json'),
        fetchImpl: undefined as unknown as typeof fetch,
      }),
    ).rejects.toMatchObject({ code: 'E_CHANNEL_RESOLVE_FAILED' });
  });
});

describe('validateStableLockDocument', () => {
  it('throws E_CHANNEL_LOCK_INVALID when stable channel is missing', () => {
    expect(() =>
      validateStableLockDocument({
        channels: {},
      }),
    ).toThrow(/E_CHANNEL_LOCK_INVALID/);
  });

  it('throws E_CHANNEL_LOCK_INVALID when sha format is invalid', () => {
    expect(() =>
      validateStableLockDocument({
        channels: {
          stable: {
            repo: STABLE_REPO_URL,
            sha: 'not-a-sha',
          },
        },
      }),
    ).toThrow(/E_CHANNEL_LOCK_INVALID/);
  });

  it('throws E_CHANNEL_LOCK_INVALID for invalid repo/sha', () => {
    expect(() =>
      validateStableLockDocument({
        channels: {
          stable: {
            repo: 'https://example.com/other.git',
            sha: 'abc',
          },
        },
      }),
    ).toThrow(/E_CHANNEL_LOCK_INVALID/);
  });
});

describe('runDelegatedChannel', () => {
  it('delegates with npm exec and strips --channel from forwarded args', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');

    const spawnCalls: Array<{ command: string; args: string[]; env: Record<string, string> }> = [];
    const spawnImpl = (command: string, args: string[], options: { env: Record<string, string> }) => {
      spawnCalls.push({ command, args, env: options.env });
      const child = new EventEmitter() as EventEmitter & { on: any };
      queueMicrotask(() => child.emit('close', 0));
      return child;
    };

    const result = await runDelegatedChannel({
      channel: 'stable',
      rawArgv: ['vendor', 'install', '--channel', 'stable', '--prefix', 'myui'],
      env: {
        [CHANNEL_CACHE_PATH_ENV]: cachePath,
      },
      fetchImpl: async () => ({
        ok: true,
        async json() {
          return makeLock('5555555555555555555555555555555555555555');
        },
      }),
      spawnImpl,
    });

    expect(result.delegated).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(spawnCalls.length).toBe(1);
    expect(spawnCalls[0].command).toBe('npm');
    expect(spawnCalls[0].args).toEqual([
      'exec',
      '--yes',
      '--package=git+https://github.com/monoharada/web-components-factory.git#5555555555555555555555555555555555555555',
      '--',
      'wcf',
      'vendor',
      'install',
      '--prefix',
      'myui',
    ]);
    expect(spawnCalls[0].env[CHANNEL_DELEGATED_ENV]).toBe('1');
  });

  it('does not delegate when already in delegated process', async () => {
    const result = await runDelegatedChannel({
      channel: 'stable',
      rawArgv: ['blocks', 'list'],
      env: {
        [CHANNEL_DELEGATED_ENV]: '1',
        [CHANNEL_CACHE_PATH_ENV]: '/tmp/unused',
      },
    });

    expect(result.delegated).toBe(false);
  });

  it('propagates spawn errors as E_CHANNEL_RESOLVE_FAILED', async () => {
    const tmp = await makeTempDir();
    tempDirs.push(tmp);
    const cachePath = path.join(tmp, 'channel-cache.json');

    const spawnImpl = () => {
      const child = new EventEmitter() as EventEmitter & { on: any };
      queueMicrotask(() => child.emit('error', new Error('spawn failed')));
      return child;
    };

    await expect(
      runDelegatedChannel({
        channel: 'stable',
        rawArgv: ['blocks', 'list', '--channel=stable'],
        env: {
          [CHANNEL_CACHE_PATH_ENV]: cachePath,
        },
        fetchImpl: async () => ({
          ok: true,
          async json() {
            return makeLock('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          },
        }),
        spawnImpl: spawnImpl as unknown as typeof import('node:child_process').spawn,
      }),
    ).rejects.toMatchObject({ code: 'E_CHANNEL_RESOLVE_FAILED' });
  });

  it('uses default argv/env behavior when optional inputs are omitted', async () => {
    const spawnCalls: Array<{ args: string[] }> = [];
    const spawnImpl = (_command: string, args: string[]) => {
      spawnCalls.push({ args });
      const child = new EventEmitter() as EventEmitter & { on: any };
      queueMicrotask(() => child.emit('close', null));
      return child;
    };

    const result = await runDelegatedChannel({
      channel: 'stable',
      env: {},
      fetchImpl: async () => ({
        ok: true,
        async json() {
          return makeLock('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        },
      }),
      spawnImpl: spawnImpl as unknown as typeof import('node:child_process').spawn,
    });

    expect(result.delegated).toBe(true);
    expect(result.exitCode).toBe(1);
    expect(spawnCalls[0]?.args).toEqual([
      'exec',
      '--yes',
      '--package=git+https://github.com/monoharada/web-components-factory.git#bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      '--',
      'wcf',
    ]);
  });
});
