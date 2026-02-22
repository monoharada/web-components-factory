export function createCliError(code, message) {
  const err = new Error(`${code}: ${message}`);
  err.code = code;
  return err;
}
