const passport = require('passport');
const UserService = require('../entity/user/user-service');
const { secret } = require('../security/config');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    UserService.findOne(email)
        .then(user => {
            if (!user) {
                return done(null, false);
            }

            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return done(err, false);
                }

                if (!isMatch) {
                    return done(null, false);
                }

                return done(null, user);
            });
        })
        .catch(error => done(error, false));
});

// Set up options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that user
    // otherwise, call done without a user object
    const { sub: id, iat } = payload;

    UserService.findById(id)
        .then((user) => {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch(error => done(error, false));
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
