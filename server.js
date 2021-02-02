const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Pass to next layer of middleware
    next();
});
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8081;

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });
});

server.listen(port);
