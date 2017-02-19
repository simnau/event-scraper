const Event = require('./event');

class EventRepository {
    find(query) {
        return Event.find(query).exec();
    }

    findAll() {
        return Event.find({}).exec();
    }

    findOne(query) {
        return Event.findOne(query).exec();
    }

    findById(id) {
        return Event.findById(id).exec();
    }

    save(event) {
        return new Event(event).save();
    }
}

module.exports = new EventRepository();