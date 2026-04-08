
const fs = require("fs");
const path = require("path");
const url = require("url");

const MIME_TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
}

function serveStaticFile(req, res){
    const baseUrl = req.protocol + "://" + req.headers.host + "/";
    const parsedUrl = new URL(req.url, baseUrl);
    console.log(parsedUrl);

    let pathSanitaze = path.normalize(parsedUrl.pathname);
    console.log("pathSanitaze: " + pathSanitaze);


    console.log("__dirname: " + __dirname);

    let pathName = path.join(__dirname, "..", "static", pathSanitaze);
    console.log("pathName: " + pathName);
    
    
    let extName = path.extname(pathName).toLowerCase();

    let contentType = MIME_TYPES[extName];


   if(fs.existsSync(pathName)){
    if(fs.statSync(pathName).isDirectory()){
        pathName = path.join(pathName, "index.html");
        contentType = MIME_TYPES[".html"];
    }

   fs.readFile(pathName, (err, data) => {
        if(err){
           console.log("Błąd odczytu pliku" + err.message);
            res.writeHead(404, {"Content-type" : MIME_TYPES[".html"]});
            res.end("404 file not found");
            return;
            
        }
        res.writeHead(200, {"Content-type": contentType});
        res.end(data);
    })
    
   }else{
    res.writeHead(404, {"Content-type": MIME_TYPES[".html"]});
    res.end("404 Page not found");
   }

    

}

module.exports = {
    serveStaticFile
}