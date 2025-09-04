const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use(cors({
    origin: ["https://dk-game.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// routes
const userRouter = require('./src/router/user.route');
const marketNameRouter = require('./src/router/marketName.route');
const createMarketRouter = require('./src/router/createMarket.route');
const guesserRequestRouter = require('./src/router/guesserRequest.route');
const buttonRouter = require('./src/router/button.route');
const guesserRouter = require('./src/router/guesser.route');
const contactUsRouter = require('./src/router/contactUs.route');
const noticeRouter = require('./src/router/notice.route');
const postRouter = require('./src/router/post.route');
const superAdminRouter = require('./src/router/superAdmin.route');

app.use('/api/d2k/', userRouter)
app.use('/api/d2k/', marketNameRouter);
app.use('/api/d2k/', createMarketRouter);
app.use('/api/d2k/', guesserRequestRouter);
app.use('/api/d2k/', buttonRouter);
app.use('/api/d2k/', guesserRouter);
app.use('/api/d2k/', contactUsRouter);
app.use('/api/d2k/', noticeRouter);
app.use('/api/d2k/', postRouter);
app.use("/api/d2k/super-admin", superAdminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app