const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/scraper';

mongoose.connect(MONGO_URL);

const db = mongoose.connection;

db.on('error', function (error) {
    console.error(error);
});

db.once('open', function () {
    console.log('Database connection open');
});