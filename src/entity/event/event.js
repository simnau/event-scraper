const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    title: String,
    date: String,
    city: String,
    location: String,
    category: Number
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;