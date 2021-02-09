const express = require("express");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
const socket = require("socket.io");
const server = require("http").Server(app);
const port = process.env.PORT || 8081;

const io = socket(server, {
    cors: {
        origin: "*",
    },
});

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

server.listen(port, () => console.log("server running on port", port));
