// import the necessary modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// load environment variables
dotenv.config({ path: './config/config.env' });

// config file
const connectDB = require('./config/database');

// route files
const albums = require('./routes/albums');
const tracks = require('./routes/tracks');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// middleware files
const errorHandler = require('./middleware/error');

// initialize express app
const app = express();

// body-parser
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// express-mongo-sanitize prevent noSQL injections
app.use(mongoSanitize());

// secure HTTP headers
app.use(helmet());

// prevent cross-side-scripting attacks
app.use(xss());

// limit API requests to 5
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100, // limit each IP upto 100 requests per windowMs
});

app.use(limiter);

// prevent HTTP param pollution
app.use(hpp());

//enable CORS
app.use(cors());

// connect database
connectDB();

// dev logging middleware: use in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file upload
app.use(fileupload());

// set public folder static folder
app.use(express.static(path.join(__dirname, 'public')));

// get homepage route
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: 'Welcome to the online music store' });
});

// mount routers
app.use('/api/v1/albums', albums);
app.use('/api/v1/tracks', tracks);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

// use error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
