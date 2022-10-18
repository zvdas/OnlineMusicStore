// import the necessary modules
const express = require('express');
const dotenv = require('dotenv');

// load environment variables
dotenv.config({ path: './config/config.env' });

// config file
const connectDB = require('./config/database');

// route files
const albums = require('./routes/albums');

// initialize express app
const app = express();

// body-parser
app.use(express.json());

// connect database
connectDB();

app.get('/', (req, res) => {
    res.status(200).json({ success: true, msg: 'Welcome to the online music store' });
});

// mount routers
app.use('/api/v1/albums', albums);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    () => console.log(`Server running in ${ process.env.NODE_ENV } mode on port ${ PORT }`)
);