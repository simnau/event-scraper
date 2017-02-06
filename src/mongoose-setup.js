const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/scraper';

mongoose.connect(MONGO_URL);