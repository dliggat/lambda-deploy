var cheerio = require('cheerio');
var request = require('request');
var url = require('url');
var fs = require('fs');
var mustache = require('mustache');
var AWS = require('aws-sdk');
var moment = require('moment');

exports.handler = function (event, context) {
    request(event.webpage, function (err, response, body) {
        if (err) console.log(err, err.stack); // an error occurred

        var $ = cheerio.load(body);
        var links = [];

        AWS.config.apiVersions = {
            s3: '2006-03-01',
            // other service API versions
        };

        var s3 = new AWS.S3();

        $("a").each(function () {
          var anchor = $(this);
          var href = anchor.attr("href");
          var text = anchor.text();

          if (typeof href !== 'undefined') {
            var abs = url.resolve(event.webpage, href);
            if (text == '') {
                text = abs;
            }

            var new_item = {
                text: text,
                url: abs
            };

            if (links.indexOf(new_item) === -1) {
                links.push(new_item);
            }
        }

    });
        fs.readFile('template.html', 'utf8', function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            var view = {
                links: links,
                page: event.webpage,
                time: moment().format('MMMM Do YYYY, h:mm:ss a')
            }
            var output = mustache.render(data, view);

            var s3_params = {
                Bucket: 'fooblar',
                Key: 'links.html',
                ContentType: 'text/html',
                Body: output
            };
            s3.putObject(s3_params, function (err, data) {
                if (err) {
                  console.log('BOOOO');
                  console.log(data);
                  console.log(err, err.stack); // an error occurred
                }
                context.done(null, 'link-scraper complete.');
            });

        });

    })
};
