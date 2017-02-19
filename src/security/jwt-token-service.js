const jwt = require('jwt-simple');
const { secret } = require('./config');

class JwtTokenService {
    createTokenForUser(user) {
        const timestamp = new Date().getTime();
        return jwt.encode({ sub: user.id, iat: timestamp }, secret);
    }
}

module.exports = new JwtTokenService();