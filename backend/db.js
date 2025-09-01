require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI =`${process.env.MONGODBURI}`
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};
module.exports = connectToMongo;
