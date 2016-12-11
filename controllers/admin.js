const express = require('express');
const mongoose = require('mongoose');
const async = require('async');

const User = require('../models/User');

const api = express();

function checkIsAdmin(req, res, next) {
    console.log('checking for admin');
    if (req.session.user_id) {

        User.findById(req.session.user_id, function(err, user) {
            if (err) {
                return res.send(err);
            }

            if (!user) {
                return res.send('You are not an admin. If you are, try to relog');
            }
            console.log('success');
            next();
        });
    } else {
        return res.send('you need to log in');
    }
}

api.post('/auth', function(req, res) {
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

api.post('/logout', function(req, res) {
    req.session.user_id = null;
    req.session.save(function() {
        res.send();
    });
});

api.post('/createAdmin', checkIsAdmin, function(req, res) {
    console.log('1');
    const NewUser = mongoose.model('User');
    console.log(2);
    let user = {
        login: req.body.login,
        password: NewUser.hashPassword(req.body.password),
        is_admin: true
    }
    console.log('trying create new user:', user);
    NewUser.create(user, function() {
        console.log('created user: ', user);
        res.send({
            err:null,
            message: 'done'
        });
    });
})

module.exports = api;
