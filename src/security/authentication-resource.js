const express = require('express');
const passport = require('passport');

const UserService = require('../entity/user/user-service');
const JwtTokenService = require('./jwt-token-service');
const { requireSignin } = require('./passport-strategies');

const router = express.Router();

router.post('/authenticate', requireSignin, (req, res) => {
    const { user } = req;
    res.json({ token: JwtTokenService.createTokenForUser(user) });
});

router.post('/signup', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide an email and a password' });
    }

    const lowercaseEmail = email.toLowerCase();

    UserService.findOne(lowercaseEmail)
        .then((existingUser) => {
            if (existingUser) {
                return res.status(422).send({ error: 'Email is in use' });
            }

            const user = {
                email: lowercaseEmail,
                password,
            };

            UserService.save(user)
                .then(() => {
                    res.json({ token: JwtTokenService.createTokenForUser(user) })
                })
                .catch(error => next(error));
        })
        .catch(error => next(error));
});

module.exports = router;