const EventRepository = require('./event-repository');

const EventService = {
    find: function (query) {
        return EventRepository.find(query);
    },
    findAll: function (query) {
        return EventRepository.findAll();
    },
    findOne: function (query) {
        return EventRepository.findOne(query);
    },
    findById: function (id) {
        return EventRepository.findById(id);
    },
    save: function (event) {
        return EventRepository.save(event);
    }
};

module.exports = EventService;