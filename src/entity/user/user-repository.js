const User = require('./user');

class UserRepository {
    save(user) {
        return new User(user).save();
    }

    findOne(email) {
        return User.findOne({ email }).exec();
    }

    findById(id) {
        return User.findById(id).exec();
    }
}

module.exports = new UserRepository();