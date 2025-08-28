import { serve } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

const server = serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    // ルートの場合は viewer.html を返す
    if (path === "/") {
      path = "/viewer.html";
    }
    
    // ファイルパスを構築
    const filePath = join(process.cwd(), path === "/" ? "viewer.html" : path.slice(1));
    
    console.log(`Request: ${path} -> ${filePath}`);
    
    try {
      // ファイルの拡張子からMIMEタイプを決定
      const ext = filePath.split('.').pop();
      let contentType = "text/plain";
      
      switch (ext) {
        case "html":
          contentType = "text/html";
          break;
        case "js":
        case "mjs":
          contentType = "application/javascript";
          break;
        case "ts":
          // TypeScriptファイルはBunで自動的にトランスパイル
          console.log(`Transpiling TypeScript: ${filePath}`);
          try {
            const tsContent = readFileSync(filePath, "utf-8");
            console.log(`File read successfully, length: ${tsContent.length}`);
            const transpiler = new Bun.Transpiler({
              loader: "ts",
              target: "browser"
            });
            const transpiled = transpiler.transformSync(tsContent);
            console.log(`Transpiled successfully, length: ${transpiled.length}`);
            return new Response(transpiled, {
              headers: { "Content-Type": "application/javascript" }
            });
          } catch (error) {
            console.error(`Transpilation error for ${filePath}:`, error);
            return new Response(`// Transpilation error: ${error.message}`, {
              status: 500,
              headers: { "Content-Type": "application/javascript" }
            });
          }
        case "css":
          contentType = "text/css";
          break;
        case "json":
          contentType = "application/json";
          break;
      }
      
      // ファイルを読み込んで返す
      const file = Bun.file(filePath);
      return new Response(file, {
        headers: { "Content-Type": contentType }
      });
      
    } catch (error) {
      // エラーの場合は404
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
console.log(`📋 View components at http://localhost:${server.port}`);