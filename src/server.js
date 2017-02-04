const request = require('request');
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const querystring = require('querystring');

const baseUrl = 'http://www.tiketa.lt';
const nextPageUrl = '/LT/Index/NextPage';

const URL_CONFIGURATIONS = [{
    url: '/LT/koncertai',
    categoryId: 2
}, {
    url: '/LT/sportas',
    categoryId: 3
}, {
   url: '/LT/teatras_ir_menai',
    categoryId: 4
}, {
    url: '/LT/seimai',
    categoryId: 5
}, {
    url: '/LT/festivaliai',
    categoryId: 51
}, {
    url: '/LT/kinas',
    categoryId: 52
}, {
    url: '/LT/seminarai',
    categoryId: 65
}];

function getEventInfo(url) {
    request(baseUrl + url, function (error, response, html) {
        const $ = cheerio.load(html);

        const title = $('.contest-page-main-banner').find('.title').text();

        $('.contest').find('.page-content-left').each(function (i, element) {
            const $element = $(element);
            const month = $element.find('.date-month').text();
            const time = $element.find('.date-time').text();
            const location = $element.find('.title-block').find('p').text();

            const city = location.substring(0, location.indexOf(',')).trim();
            const place = location.substring(location.indexOf(',') + 1).trim();

            const event = {
                title: title,
                month: month,
                time: time,
                city: city,
                place: place
            };
            console.log(event);
        });
    });
}

function getPageData(pageId, categoryId) {
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

                getEventInfo(link);
            });

            const more = $('#pageEnd' + pageId);

            if (more[0]) {
                getPageData(pageId + 1, categoryId);
            }
        })
        .catch(function (error) {

        });
}

URL_CONFIGURATIONS.forEach(function (urlConfig) {
    request(baseUrl + urlConfig.url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $('#eventsContainter').find('a.article-content-container').each(function (i, element) {
                const link = $(element).attr('href');

                getEventInfo(link);
            });
        }
    });

    getPageData(0, urlConfig.categoryId);
});