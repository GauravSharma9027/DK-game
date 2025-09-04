const mongoose = require('mongoose');
const SuperAdminModel = require('../model/SuperAdmin.model');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("Database Connected Successfully");
        const created = await SuperAdminModel.seedSuperAdminIfNeeded();
        if (created) {
            console.log("🚀 Super Admin seeded from .env");
        } else {
            console.log("ℹ️ Super Admin already exists");
        }
    } catch (error) {
        console.log("Some error in database connection", error.message);
    }
}

module.exports = connectDB;