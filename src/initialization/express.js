const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const event = require('../entity/event/event-resource');
const scraper = require('../scraper/scraper-resource');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/api/event', event);
app.use('/api/scrape', scraper);

app.listen(8080, function () {
    console.log('Listening on port 8080!')
});