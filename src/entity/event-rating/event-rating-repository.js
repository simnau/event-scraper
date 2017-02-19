const mongoose = require('mongoose');
const EventRating = require('./event-rating');

class EventRatingRepository {
    save(rating, eventId, userId) {
        return new EventRating({ rating, eventId, userId }).save();
    }

    findByEvent(eventId) {
        return EventRating.find({ eventId }).exec();
    }

    findByEventAndUser(eventId, userId) {
        return EventRating.findOne({ eventId, userId }).exec();
    }
}

module.exports = new EventRatingRepository();