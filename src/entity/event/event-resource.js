const express = require('express');
const EventService = require('./event-service');
const EventRatingService = require('../event-rating/event-rating-service');
const router = express.Router();

router.get('/', function (req, res) {
    EventService.findAll().then(function (events) {
        res.json(events);
    });
});

router.get('/:eventId', function (req, res) {
    EventService.findById(req.params.eventId).then(function (event) {
        res.json(event);
    })
});

router.post('/rating/:eventId', function (req, res) {
    const rating = req.body.rating;
    const eventId = req.params.eventId;
    EventRatingService.save({ rating: rating, eventId: eventId })
        .then(function () {
            return EventRatingService.findByEvent(eventId);
        })
        .then(function (ratings) {
            const averageRating = EventRatingService.findAverageRating(ratings);
            res.json({ averageRating: averageRating, voteCount: ratings.length, rating: rating });
        });
});

router.get('/rating/:eventId', function (req, res) {
    EventRatingService.findByEvent(req.params.eventId)
        .then(function (ratings) {
            const averageRating = EventRatingService.findAverageRating(ratings);
            res.json({ averageRating: averageRating, voteCount: ratings.length });
        });
});

module.exports = router;