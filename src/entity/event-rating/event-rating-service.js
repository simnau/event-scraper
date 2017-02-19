const EventRatingRepository = require('./event-rating-repository');

class EventRatingService {
    save(rating, eventId, userId) {
        return EventRatingRepository.save(rating, eventId, userId);
    }

    findByEvent(eventId) {
        return EventRatingRepository.findByEvent(eventId);
    }

    findByEventAndUser(eventId, userId) {
        return EventRatingRepository.findByEventAndUser(eventId, userId);
    }

    findAverageRating(ratings) {
        const averageRating = ratings.reduce((result, rating) => {
            return result + rating.rating / ratings.length;
        }, 0);

        return averageRating.toFixed(2);
    }
}

module.exports = new EventRatingService();