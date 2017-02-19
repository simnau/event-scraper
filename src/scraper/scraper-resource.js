const express = require('express');

const ScraperService = require('./scraper-service');
const { requireAuth } = require('../security/passport-strategies');
const router = express.Router();

router.get('/', requireAuth, function (req, res) {
    ScraperService.scrape();
    res.send('Began scraping');
});

module.exports = router;