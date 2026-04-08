const http = require("http");
const {getQuotes, getQuote, getRandom, prepareDb, deleteByID, updateByID, insertQuote} = require("./controllers/quote_controller");

const {serveStaticFile} = require("./util/staticServer");
const { json } = require("stream/consumers");

const PORT = 8080;

const APP_CONTENT_TYPE = {"Content-type": "application/json"};


const server = http.createServer(async (req, res) => {
    //console.log("Request");
    //await prepareDb();
    if(req.url === "/api/quotes" && req.method === "GET"){
        let quotes = await getQuotes();
        if(quotes){
            res.writeHead(200, APP_CONTENT_TYPE);
        } else{
            res.writeHead(404, APP_CONTENT_TYPE);
            quotes = {message: "quotes not found"};
        }
        res.end(JSON.stringify(quotes))
    }else if(req.url === "/api/quotes/random" && req.method === "GET"){
        let quote = await getRandom();
        console.log(quote);
        if(quote){
            res.writeHead(200, APP_CONTENT_TYPE);
        }else{
            res.writeHead(404, APP_CONTENT_TYPE);
            quote = {message: "quote not found"};

        }
        res.end(JSON.stringify(quote));
        
    } else if(req.url.match(/\/api\/quotes\/([0-9a-z]+)/) && req.method === "GET"){
        const id = req.url.split("/")[3];

        let quote = await getQuote(id);
        if(quote){
            res.writeHead(200, APP_CONTENT_TYPE);
        }else{
            res.writeHead(404, APP_CONTENT_TYPE);
            quote = {message: `quote with id ${id} not found`};
        }
        res.end(JSON.stringify(quote));
    }else if(req.url === "/api/quote/save" && req.method === "POST"){
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", async() => {
            const quote = JSON.parse(data);
            let response = {}
            const result = await insertQuote(quote);
            if(result){
                res.writeHead(200, APP_CONTENT_TYPE);
                response = {saved:true, _id: result.insertedId};
            }else{
                res.writeHead(404, APP_CONTENT_TYPE);
                response = {saved: false, _id: null};
            }
            res.end(JSON.stringify(response));
        });
    }else if(req.url === "/api/quote/delete" && req.method ==="POST"){
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", async() => {
            const quote = JSON.parse(data);
            if(!quote || !quote._id){
                res.end(JSON.stringify({message: "Bad id!"}));
                return;
            }
            let response = {};
            const result = await deleteByID(quote._id);
            if(result && result.deletedCount > 0){
                res.writeHead(200, APP_CONTENT_TYPE);
                response = {deleted: true}
            }else{
                res.writeHead(404, APP_CONTENT_TYPE);
                response = {deleted: false};
            }
            res.end(JSON.stringify(response));

        });
    }
    
    else{
        serveStaticFile(req, res);
    }
});

server.listen(PORT);

