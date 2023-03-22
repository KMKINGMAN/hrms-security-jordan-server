const express = require("express");
const server = require("http");
const socketIo = require("socket.io");
const { config } = require("dotenv");
const { readdirSync } = require("fs");
const { io } = require("socket.io-client");
const Emitter = require('events');
const eventEmitter = new Emitter();
config();

class SERVER {
    constructor(){
        this.app = express();
        this.server = this.app.listen(Number(process.env.PORT), ()=> {
            console.log(`This app is running on port ${process.env.PORT}`)
        });
        this.io = require('socket.io')(server, {
            cors: {
              origin: '*',
              methods: ['GET', 'POST']
            }
        });
        this.app.use((req, res, next)=>{
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
            next();
          });
        this.Setup();
        this.Routes();
        this.app.set("eventEmitter", eventEmitter);
        this.SocketIO()

    }
    Setup(){
        this.app.use(express.json());
    }
    async Routes(){
        let files = readdirSync("./src/routers/").filter(file=> file.endsWith(".js"));
        return await Promise.all([
            files.map(async(file)=> {
                let routerObject = require("./../routers/" + file);
                this.app.use(routerObject.main, routerObject.router);
                console.log(`Loaded [${file} - from "./src/routers/${file}"] and this router path ${routerObject.main}`)
            })
        ]);
    };
    SocketIO(){
        this.io.on('connection', (socket) => {
            console.log(socket.id);
      });
        eventEmitter.on('index', (data) => {
        console.log("Here")
        this.io.emit('visitIndex', data);
      })
    }
}
module.exports = SERVER;