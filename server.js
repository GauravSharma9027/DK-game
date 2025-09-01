const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/connectDB.config');
connectDB();
const { initSocket } = require('./src/utils/socket.utils');
initSocket(server);


// Button create
// const { createButton } = require('./src/controller/button.controller');
// createButton()

const PORT = process.env.PORT;
server.listen(PORT, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`server is running on ${PORT}`);
    }
})
