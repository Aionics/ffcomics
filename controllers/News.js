const express = require('express');
const news = express();
const mongoose = require('mongoose');
const middleware = require('../middleware');
const path = require('path');
const transliterate = require('transliterate');
const multiparty = require('multiparty');
const async = require('async');
const fs = require('fs');

const News = require('../models/News');

news.post('/create', middleware.checkIsAdmin, function (req, res) {
    const form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
            return res.respond(err);
        }
        let title = fields.title[0];
        let lead = fields.lead[0];
        let items = JSON.parse(fields.items[0]);
        let currentTime = Date.now()

        async.map(
            files,
            function (imageSet, nextImageSet) {
                let index = 0;
                async.map(
                    imageSet,
                    function (rawImage, nextRawImage) {
                        let image = fs.readFileSync(rawImage.path);
                        let extname = path.extname(rawImage.originalFilename);
                        let imageName = transliterate(title).replace(/ /g, '-').toLowerCase() + '-' + index + '-' + currentTime + extname;
                        fs.writeFileSync(__rootDir + '/data/images/' + imageName, image);

                        let numberOfItem = rawImage.fieldName.split('#')[1]
                        items[numberOfItem].data[index].src = imageName
                        index++;
                        nextRawImage()
                    }
                )
                nextImageSet()
            },
            function (err, result) {
                newNews = {
                    title: title,
                    lead: lead,
                    items: items
                }
                News.create(newNews, function (err) {
                    if (err) {
                        console.log('posted news: ', newNews);
                        return res.respond(err);
                    }
                    res.respond(null, 'Новость опубликована!');
                });
            }
        )

    });
});

news.get('/lastnews', function (req, res, next) {
    News.find({}, {}, { limit: 5, sort: { 'created_at': -1 } }, function (err, lastNews) {
        if (err) {
            console.log('news error: ', err);
            return res.respond(err);
        }
        res.respond(null, lastNews);
    });
});

module.exports = news;
