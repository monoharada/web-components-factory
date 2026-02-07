# vendor-search-results demo

```bash
cd examples/vendor-search-results
node ../../scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern search-results
node ../../scripts/wcf/cli.js page create --pattern search-results --prefix myui --dir . --entry boot
python3 -m http.server 4173
# open http://localhost:4173/index.html
```

`index.html` は no-build（importmap + ESM）で動作し、vendor 配下は編集可能です。
