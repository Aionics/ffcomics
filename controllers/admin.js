const express = require('express');
const mongoose = require('mongoose');
const async = require('async');

const User = require('../models/User');

const api = express();

function checkIsAdmin(req, res, next) {
    if (req.session.user_id) {

        User.findOne({
            _id: mongoose.Types.ObjectId(req.session.user_id),
            is_admin: true
        }, function(err, user) {
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

api.post('/auth', function(req, res) {
    let login = req.body.login
    let password = req.body.password

    if (!login || !password) {
        return res.respond('fill_required');
    }
    User.findOne({
        login: login,
        password: User.hashPassword(password)
    }, function(err, user) {
        if (err) {
            return res.respond(err);
        }

        if (!user) {
            return res.respond('user not found');
        }

        req.session.user_id = user.id;
        req.session.save(function() {
            console.log('admin authed: ', user);
            res.respond(null, user.toObject());
        });
    });
});

api.post('/logout', checkIsAdmin, function(req, res) {
    req.session.user_id = null;
    req.session.save(function() {
        res.respond(null, 'ok');
    });
});

api.post('/createAdmin', checkIsAdmin, function(req, res) {
    const NewUser = mongoose.model('User');
    let user = {
        login: req.body.login,
        password: NewUser.hashPassword(req.body.password),
        is_admin: true
    }
    NewUser.create(user, function() {
        console.log('created user: ', user);
        res.respond(null, 'ok');
    });
})

module.exports = api;
