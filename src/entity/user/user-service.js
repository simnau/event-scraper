const UserRepository = require('./user-repository');

class UserService {
    save(user) {
        return UserRepository.save(user);
    }

    findOne(email) {
        return UserRepository.findOne(email);
    }

    findById(id) {
        return UserRepository.findById(id);
    }
}

module.exports = new UserService();