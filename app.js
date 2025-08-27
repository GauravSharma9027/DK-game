const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors());

// routes
const userRouter = require('./src/router/user.route');
const marketNameRouter = require('./src/router/marketName.route');
const createMarketRouter = require('./src/router/createMarket.route');
const GuesserRouter = require('./src/router/guesserRequest.route');

app.use('/api/d2k/', userRouter);
app.use('/api/d2k/', marketNameRouter);
app.use('/api/d2k/', createMarketRouter);
app.use('/api/d2k/', GuesserRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app