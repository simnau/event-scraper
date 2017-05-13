const express = require('express');

const { requireAuth } = require('../../security/passport-strategies');
const userService = require('../user/user-service');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
    const { _id } = req.user;
    userService.findById(_id)
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({ error: 'There was an error processing the request' });
        })
});

module.exports = router;