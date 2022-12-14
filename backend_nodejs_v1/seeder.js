// import the necessary modules
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env variables
dotenv.config({ path: './config/config.env' });

// load models
const Album = require('./models/Album');
const Track = require('./models/Track');
const User = require('./models/User');
const Review = require('./models/Review');

// connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  UseUnifiedTopology: true,
});

// read JSON files
const albums = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/albums.json`, 'utf-8')
);
const tracks = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/tracks.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// import into db
const importData = async () => {
  try {
    await Album.create(albums);
    await Track.create(tracks);
    await User.create(users);
    await Review.create(reviews);

    console.log('data imported...'.green.inverse);
    // exit the process
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete from db
const deleteData = async () => {
  try {
    await Album.deleteMany();
    await Track.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('data deleted...'.red.inverse);
    // exit the process
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// add command line argument to import or delete data
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
