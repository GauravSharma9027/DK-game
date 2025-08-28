const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/connectDB.config');
connectDB();
const cron = require('node-cron');

// variable
const PORT = process.env.PORT;

// Button create
// const { createButton } = require('./src/controller/button.controller');
// createButton()

// --- Node-cron setup here ---
// 0 0 * * * = 12AM
// */30 * * * * * = 30 sec
const UserModel = require('./src/model/User.model');
cron.schedule('0 0 * * *', async () => {
    try {
        const result = await UserModel.updateMany({}, { $set: { votes: [] } });
        console.log(`Votes reset for all users at 12 AM IST. Modified count: ${result.modifiedCount}`);
    } catch (error) {
        console.error('Error resetting votes:', error.message);
    }
}, {
    timezone: "Asia/Kolkata"
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`server is running on ${PORT}`);
    }
})
