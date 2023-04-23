import express from 'express';
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import path from 'path';


const app = express();

const PORT = process.env.PORT || 5000

app.use(express.static('public'));

app.get('*', (req, res) => {
    //res.send("/");
    res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5000", "http://192.168.0.122:5000", "http://192.168.60.130:5000"],
        methods: ["GET", "POST"]
    }
});


server.listen(PORT, () => {
    console.log('listening on *:5000');
});

io.on('connection', (socket) => {
    socket.on('send order', (tableNr, order) => {
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
