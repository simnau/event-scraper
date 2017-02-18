const cheerio = require('cheerio');
const rp = require('request-promise');
const EventService = require('../entity/event/event-service');

const constants = require('./scraper-constants');
const URL_CONFIGURATIONS = constants.URL_CONFIGURATIONS;
const BASE_URL = constants.BASE_URL;
const NEXT_PAGE_URL = constants.NEXT_PAGE_URL;

function getEventInfo(url, localCategory) {
    const options = {
        uri: BASE_URL + url
    };

    rp(options)
        .then(function (response) {
            const $ = cheerio.load(response);

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

                EventService.findOne(event).then(function (error, foundEvent) {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    if (!foundEvent) {
                        EventService.save(event);
                    }
                });
            });
        })
        .catch(function (error) {
            console.error(error);
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
        uri: BASE_URL + NEXT_PAGE_URL,
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

const ScraperService = {
    scrape: function () {
        URL_CONFIGURATIONS.forEach(function (urlConfig) {
            request(BASE_URL + urlConfig.url, function (error, response, html) {
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
    }
};

module.exports = ScraperService;