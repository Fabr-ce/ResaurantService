import express from 'express';
import cors from "cors"
import http from "http"
import { Server } from "socket.io"


const app = express();



app.use(express.static('public'));

app.get('*', (req, res) => {
      res.send("/");
      //res.sendFile(path.resolve(process.cwd(), 'public', 'index.html')); 
});


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


server.listen(5000, () => {
    console.log('listening on *:5000');
});

io.on('connection', (socket) => {
    socket.on('send order', (tableNr, order) => {
        //console.log("got order", tableNr, order)
        socket.to(["kitchen", "screen"]).emit("receive order", tableNr, order)
    })

    socket.on("finished order", (tableNr) => {
        socket.to("screen").emit("finished order", tableNr)
    })
    socket.on("unfinished order", (tableNr) => {
        socket.to("screen").emit("unfinished order", tableNr)
    })

    socket.on("remove order", (tableNr) => {
        socket.to("screen").emit("remove order", tableNr)
    })


    socket.on("enter service", () => {
        socket.join("service")
    })
    socket.on("enter kitchen", () => {
        socket.join("kitchen")
    })
    socket.on("enter screen", () => {
        socket.join("screen")
    })


    //console.log(socket.id)
    socket.broadcast.emit('hi', socket.id);
    socket.join("kitchen")
    socket.to("kitchen").emit("Hey kitchen")
    //console.log('a user connected');


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
