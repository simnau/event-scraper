const EventRating = require('./event-rating');

const EventRatingRepository = {
    save: function (eventRating) {
        return new EventRating(eventRating).save();
    },
    findByEvent: function (eventId) {
        return EventRating.find({ eventId: eventId }).exec();
    }
};

module.exports = EventRatingRepository;