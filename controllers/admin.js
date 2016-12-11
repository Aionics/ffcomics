const express = require('express');
const mongoose = require('mongoose');
const async = require('async');

const User = require('../models/User');

const api = express();

api.post('/auth', function (req, res) {
    let login = req.body.login
    let password = req.body.password

    if (!login || !password) {
        return res.send('fill_required');
    }

    console.log(req.session);

    User.findOne({
        login: login,
        password: User.hashPassword(password)
    }, function(err, user) {
        if (err) {
            return res.send(err);
        }

        if (!user) {
            return res.send('user not found');
        }

        req.session.user_id = user.id;
        req.session.save(function() {
            console.log('admin authed: ', user);
            res.send({
                err: null,
                user: user.toObject()
            });
        });
    });
});

module.exports = api;
