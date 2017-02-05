const express = require('express');
const api = express();
const mongoose = require('mongoose');
const middleware = require('../middleware');
const path = require('path');
const transliterate = require('transliterate');
const multer = require('multer')

const News = require('../models/News');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/images/');
    },
    filename: function (req, file, cb) {
        let newName = transliterate(req.body.title).replace(/ /g, '-').toLowerCase();
        let random36 = (Math.random().toString(36)+'000000000000000000').slice(2, 10)
        newName = newName + '_' + random36 + '-' + Date.now() + path.extname(file.originalname);
        cb(null, newName);
    }
})
const uploader = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!(path.extname(file.originalname) === '.png' || path.extname(file.originalname) === '.jpg')) {
            return cb('Only jpg/png are allowed');
        }

        cb(null, true);
    }
}).array('images[]', 12);

api.use('/create', middleware.checkFolder);
api.use('/create', middleware.checkIsAdmin);
api.use('/create', uploader);
api.post('/create', function (req, res) {
    for (prop in req.body) {
        if (req.body[prop] === 'undefined' || req.body[prop] === '') {
            return res.respond(prop + ' is required!');
            break;
        }
    }
    let { title, lead, text, selectedImages } = req.body;
    let images = req.files;
    let imagesToSave = []

    images.forEach(function (image, index) {
        let _image = {
            path: image.filename,
            selected: selectedImages.indexOf(index) !== -1
        };
        imagesToSave.push(_image);
    })

    let newNews = {
        title: title,
        lead: lead,
        text: text,
        images: imagesToSave
    }
    News.create(newNews, function () {
        console.log('posted news: ', newNews);
    });

    res.respond(null, 'ok');
});

api.post('/', function (req, res, next) {
    News.find({}, {}, { limit: 5, sort: { 'created_at': -1 } }, function (err, news) {
        if (err) {
            console.log('news error: ', err);
            return res.respond(err);
        }
        res.respond(null, news);
    });
})

module.exports = api;
