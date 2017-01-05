const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const transliterate = require('transliterate');
const api = express();
const multer = require('multer')
const fs = require('fs');

const News = require('../models/News');
const User = require('../models/User');

function checkIsAdmin(req, res, next) {
    if (req.session.user_id) {
        User.findOne({
            _id: mongoose.Types.ObjectId(req.session.user_id),
            is_admin: true
        }, function (err, user) {
            if (err) {
                return res.respond(err);
            }

            if (!user) {
                return res.respond('You are not an admin. If you are, try to relog');
            }
            next();
        });
    } else {
        return res.respond('you need to log in');
    }
}

function checkfolder(req, res, next) {
    if (!fs.existsSync(__dirname + '/../data/')) {
        fs.mkdirSync(__dirname + '/../data/');
    };
    if (!fs.existsSync(__dirname + '/../data/images/')) {
        fs.mkdirSync(__dirname + '/../data/images/');
    };
    next()
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/images/');
    },
    filename: function (req, file, cb) {
        let newName = transliterate(req.body.title).replace(/ /g, '_').toLowerCase();
        newName = Date.now() + '-' + newName + path.extname(file.originalname);
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
}).single('news-image');

api.use('/create', checkfolder);
api.use('/create', checkIsAdmin);
api.use('/create', uploader);
api.post('/create', function (req, res) {
    for (prop in req.body) {
        if (req.body[prop] === '') {
            return res.respond(prop + ' is required!');
        }
    }
    let { title, lead, text } = req.body;
    let newNews = {
        title: title,
        lead: lead,
        text: text,
        img: req.file.filename,
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
