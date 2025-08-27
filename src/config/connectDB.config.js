const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Some error in database connection", error.message);
    }
}

module.exports = connectDB;