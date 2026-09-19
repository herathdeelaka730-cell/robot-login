const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const root=__dirname;
const port=Number(process.env.PORT)||4173;
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".png":"image/png",".svg":"image/svg+xml"};

http.createServer((request,response)=>{
  const requestPath=decodeURIComponent((request.url||"/").split("?")[0]);
  const relative=requestPath==="/"?"index.html":requestPath.replace(/^\/+/, "");
  const filePath=path.resolve(root,relative);
  if(!filePath.startsWith(`${root}${path.sep}`)&&filePath!==path.join(root,"index.html")){response.writeHead(403).end("Forbidden");return}
  fs.stat(filePath,(error,stats)=>{
    if(error||!stats.isFile()){response.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"}).end("Not found");return}
    response.writeHead(200,{"Content-Type":mime[path.extname(filePath).toLowerCase()]||"application/octet-stream","Cache-Control":"no-cache"});
    fs.createReadStream(filePath).pipe(response);
  });
}).listen(port,"127.0.0.1",()=>console.log(`Orbit login is running at http://127.0.0.1:${port}`));
