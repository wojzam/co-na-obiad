const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectDB() {
    try {
        await mongoose.connect(uri, {dbName : "db"});
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

module.exports = connectDB;
