const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB using Mongoose!");
        console.log(uri[0])
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

module.exports = connectDB;
