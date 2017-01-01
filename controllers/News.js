const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const transliterate = require('transliterate');
const api = express();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/images/');
    }
})

const uploader = multer({
    fileFilter: function (req, file, cb) {
        if (!(path.extname(file.originalname) === '.png' || path.extname(file.originalname) === '.jpg')) {
            return cb('Only jpg/png are allowed');
        }

        cb(null, true);
    }
})

const News = require('../models/News');
const User = require('../models/User');

function checkIsAdmin(req, res, next) {
    if (req.session.user_id) {

        User.findOne({
            _id: mongoose.Types.ObjectId(req.session.user_id),
            is_admin: true
        }, function(err, user) {
            if (err) {
                return res.send(err);
            }

            if (!user) {
                return res.send('You are not an admin. If you are, try to relog');
            }
            next();
        });
    } else {
        return res.send('you need to log in');
    }
}

api.use('/create', uploader.single('news-image'));
api.post('/create', checkIsAdmin, function(req, res) {
    console.log(req.file);
    console.log(req.body);

    for (prop in req.body) {
        if (req.body[prop] === '') {
            return res.respond(prop + ' is required!');
        }
    }
});

module.exports = api;
