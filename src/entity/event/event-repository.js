const Event = require('./event');

const EventRepository = {
    find: function (query) {
        return Event.find(query).exec();
    },
    findAll: function () {
        return Event.find({}).exec();
    },
    findOne: function (query) {
        return Event.findOne(query).exec();
    },
    findById: function (id) {
        return Event.findById(id).exec();
    },
    save: function (event) {
        return new Event(event).save();
    }
};

module.exports = EventRepository;