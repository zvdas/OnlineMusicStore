const mongoose = require('mongoose');

const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        UseUnifiedTopology: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;