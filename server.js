const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

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
