let io;

const initSocket = (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // production me apne frontend ka URL dena
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("User disconnect:", socket.id);
        });
    });
    return io;
}

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = {
    initSocket,
    getIo
}