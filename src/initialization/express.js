const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const event = require('../entity/event/event-resource');
const scraper = require('../scraper/scraper-resource');
const authentication = require('../security/authentication-resource');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/event', event);
app.use('/api/scrape', scraper);
app.use('/api', authentication);

app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + (process.env.PORT || 8080) + "!");
});