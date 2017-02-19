const express = require('express');

const EventService = require('./event-service');
const EventRatingService = require('../event-rating/event-rating-service');
const { requireAuth } = require('../../security/passport-strategies');

const router = express.Router();

router.get('/', (req, res) => {
    EventService.findAll().then((events) => {
        res.json(events);
    });
});

router.get('/:eventId', (req, res) => {
    EventService.findById(req.params.eventId).then((event) => {
        res.json(event);
    });
});

router.post('/rating/:eventId', requireAuth, (req, res) => {
    const { user } = req;

    const rating = req.body.rating;
    const eventId = req.params.eventId;

    EventRatingService.findByEventAndUser(eventId, user._id)
        .then((event) => {
            if (event) {
                return Promise.reject({ status: 422, error: 'You have already rated this event' });
            }

            return EventRatingService.save(rating, eventId, user._id);
        })
        .then(() => {
            return EventRatingService.findByEvent(eventId);
        })
        .then((ratings) => {
            const averageRating = EventRatingService.findAverageRating(ratings);
            return res.json({ averageRating: averageRating, voteCount: ratings.length, rating: rating });
        })
        .catch((error) => {
            if (error.status) {
                res.status(error.status).send(error.error);
            } else {
                res.status(500).send({ error: 'There was an error processing the request' });
            }
        });
});

router.get('/rating/:eventId', (req, res) => {
    EventRatingService.findByEvent(req.params.eventId)
        .then((ratings) => {
            const averageRating = EventRatingService.findAverageRating(ratings);
            res.json({ averageRating: averageRating, voteCount: ratings.length });
        });
});

router.get('/my-rating/:eventId', requireAuth, (req, res) => {
    const { user, params } = req;

    EventRatingService.findByEventAndUser(params.eventId, user._id)
        .then((rating) => {
            if (rating) {
                res.json({rating: rating.rating});
            } else {
                res.status(404).send({ error: 'This event has not yet been rated by you' });
            }
        })
        .catch(error => res.status(500).send({ error: 'There was an error processing the request' }));
});

module.exports = router;