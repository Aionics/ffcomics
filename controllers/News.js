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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/images/');
    },
    filename: function (req, file, cb) {
        let newName = escape(transliterate(req.body.title).replace(' ', '_').toLowerCase());
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

api.use('/create', checkIsAdmin);
api.use('/create', uploader);
api.post('/create', function (req, res) {
    for (prop in req.body) {
        if (req.body[prop] === '') {
            return res.respond(null, pokp + ' is required!');
        }
    }
    let {title, lead, text} = req.body;
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

module.exports = api;
