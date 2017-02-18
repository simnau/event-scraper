const express = require('express');
const ScraperService = require('./scraper-service');
const router = express.Router();

router.get('/', function (req, res) {
    ScraperService.scrape();
    res.send('Began scraping');
});

module.exports = router;