const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/?tls=false&readPreference=primaryPreferred&directConnection=true'

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};
module.exports = connectToMongo;
