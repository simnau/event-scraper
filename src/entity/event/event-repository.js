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

    findByCategory(categoryId) {
        return Event.find({ category: categoryId }).exec();
    }
}

module.exports = new EventRepository();