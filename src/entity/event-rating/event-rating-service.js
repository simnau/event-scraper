const EventRatingRepository = require('./event-rating-repository');

const EventRatingService = {
    save: function (eventRating) {
        return EventRatingRepository.save(eventRating);
    },
    findByEvent: function (eventId) {
        return EventRatingRepository.findByEvent(eventId);
    },
    findAverageRating: function (ratings) {
        var averageRating = 0;
        ratings.forEach(function (rating) {
            averageRating += rating.rating / ratings.length;
        });

        return averageRating.toFixed(2);
    }
};

module.exports = EventRatingService;