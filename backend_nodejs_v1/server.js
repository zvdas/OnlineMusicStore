// import the necessary modules
const express = require('express');
const dotenv = require('dotenv');

// load environment variables
dotenv.config({ path: './config/config.env' });

// initialize express app
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${ process.env.NODE_ENV } mode on port ${ PORT }`));