const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventRatingSchema = new Schema({
    rating: Number,
    eventId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
});

const EventRating = mongoose.model('EventRating', eventRatingSchema);

module.exports = EventRating;