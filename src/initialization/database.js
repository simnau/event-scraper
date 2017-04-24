const mongoose = require('mongoose');
const environment = require('../environment');

const mongoUrl = process.env.MONGO_URL || environment.mongoUrl;

mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on('error', function (error) {
    console.error(error);
});

db.once('open', function () {
    console.log('Database connection open');
});