const mongoose = require('mongoose');

const eventSchema = {
    title: String,
    date: String,
    city: String,
    location: String,
    category: Number
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;