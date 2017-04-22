const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://varlius:S123N789@ds029725.mlab.com:29725/heroku_tr5r6fp1';

mongoose.connect(MONGO_URL);

const db = mongoose.connection;

db.on('error', function (error) {
    console.error(error);
});

db.once('open', function () {
    console.log('Database connection open');
});