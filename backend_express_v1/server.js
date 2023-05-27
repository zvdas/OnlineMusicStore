// import the necessary modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// load environment variables
dotenv.config({ path: './config/config.env' });

// config file
const connectDB = require('./config/mongodb.config');

// route files - apis
const albums = require('./routes/albums');
const tracks = require('./routes/tracks');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// utils files
const swaggerDocs = require('./utils/swagger');

// middleware files
const errorHandler = require('./middleware/error');

// initialize express app
const app = express();

// body-parser
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// cookie-parser
app.use(cookieParser());

// override with '_method' header in the request for PUT & DELETE
app.use(methodOverride('_method'));

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
app.use(fileUpload());

// set public folder as static folder
// app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// set view render engine as 'ejs'
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// check if signed in
app.use((req, res, next) => {
  if(req.headers.authorization === null) {
    res
      .redirect('/api/v1/auth/login');
  } else {
    next();
  }
});

// get homepage route
app.get('/', (req, res, next) => {
  res
    .status(200)
    .cookie('user', 'none')
    .cookie('user.email', 'none')
    // .json({ success: true, msg: 'Welcome to the online music store' });
    // .redirect('https://documenter.getpostman.com/view/19419701/2s8YzTThXz');
    .render('home', {user: req.cookies.user});
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

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  swaggerDocs(app, PORT);
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
