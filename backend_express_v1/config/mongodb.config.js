const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = mongoose.set("strictQuery", false);

    await conn.connect(process.env.MONGODB_URI, {
    // const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        UseUnifiedTopology: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;