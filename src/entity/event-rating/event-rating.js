const mongoose = require('mongoose');

const eventRatingSchema = {
    rating: Number,
    eventId: String
};

const EventRating = mongoose.model('EventRating', eventRatingSchema);

module.exports = EventRating;