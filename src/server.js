const request = require('request');
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const querystring = require('querystring');
const mongoose = require('mongoose');
const moment = require('moment');
const express = require('express');
const path = require('path');
const app = express();

require('./mongoose-setup');

const Event = require('./model/event');

const baseUrl = 'http://www.tiketa.lt';
const nextPageUrl = '/LT/Index/NextPage';

const URL_CONFIGURATIONS = [{
    url: '/LT/koncertai',
    categoryId: 2,
    localCategory: 1
}, /*{
    url: '/LT/sportas',
    categoryId: 3,
    localCategory: 2
}, {
   url: '/LT/teatras_ir_menai',
    categoryId: 4,
    localCategory: 3
}, {
    url: '/LT/seimai',
    categoryId: 5,
    localCategory: 4
}, {
    url: '/LT/festivaliai',
    categoryId: 51,
    localCategory: 5
}, {
    url: '/LT/kinas',
    categoryId: 52,
    localCategory: 6
}, {
    url: '/LT/seminarai',
    categoryId: 65,
    localCategory: 7
}*/];

function getEventInfo(url, localCategory) {
    request(baseUrl + url, function (error, response, html) {
        if (error) {
            console.log(error);
            return;
        }

        const $ = cheerio.load(html);

        const title = $('.contest-page-main-banner').find('.title').text();

        $('.contest').find('.page-content-left').each(function (i, element) {
            const $element = $(element);
            const date = $element.find('.date-month').text();
            const time = $element.find('.date-time').text();

            const fullDate = moment()
                .month(date.substring(0, date.indexOf('.')))
                .date(date.substring(date.indexOf('.') + 1))
                .hour(time.substring(0, time.indexOf(':')))
                .minute(time.substring(time.indexOf(':') + 1));

            const location = $element.find('.title-block').find('p').text();

            const city = location.substring(0, location.indexOf(',')).trim();
            const place = location.substring(location.indexOf(',') + 1).trim();

            const event = {
                title: title,
                date: fullDate.format('YYYY-MM-DD HH:mm'),
                city: city,
                location: place,
                category: localCategory
            };

            Event.findOne(event).exec(function (error, foundEvent) {
                if (error) {
                    console.log(error);
                    return;
                }

                if (!foundEvent) {
                    const eventObject = new Event(event);
                    eventObject.save();
                }
            });
        });
    });
}

function getPageData(pageId, categoryId, localCategory) {
    const postData = {
        sf_stype: '',
        sf_clubId: 0,
        sf_catid: categoryId,
        sf_TextFilter: '',
        sf_pageId: pageId,
        sf_order: 0
    };

    const data = querystring.stringify(postData);
    const contentLength = data.length;

    const options = {
        uri: baseUrl + nextPageUrl,
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: data,
        method: 'POST'
    };

    rp(options)
        .then(function (response) {
            const $ = cheerio.load(response);

            $('a.article-content-container').each(function (i, element) {
                const link = $(element).attr('href');

                getEventInfo(link, localCategory);
            });

            const more = $('#pageEnd' + pageId);

            if (more[0]) {
                getPageData(pageId + 1, categoryId, localCategory);
            }
        })
        .catch(function (error) {

        });
}

const db = mongoose.connection;

db.on('error', function (error) {
    console.log(error);
});

db.once('open', function () {
    console.log('open');

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });

    app.get('/api/events', function (req, res) {
        Event.find({}).exec().then(function (events) {
            res.json(events);
        });
    });

    app.get('/api/scrape', function (req, res) {
        URL_CONFIGURATIONS.forEach(function (urlConfig) {
            request(baseUrl + urlConfig.url, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);

                    $('#eventsContainter').find('a.article-content-container').each(function (i, element) {
                        const link = $(element).attr('href');

                        getEventInfo(link, urlConfig.localCategory);
                    });
                }
            });

            getPageData(0, urlConfig.categoryId, urlConfig.localCategory);
        });
        res.send('began scraping');
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!')
    });
});