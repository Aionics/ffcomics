const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const cookie_parser = require('cookie-parser');
const path = require("path");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const config = require('./config')
global.__rootDir = __dirname;


app.set('json spaces', 40);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (err, res, next) {
    res.respond = function (err, data) {
        if (typeof data == 'undefind') {
            data = null;
        }
        let answer = {
            err: err,
            data: data
        }
        res.send(answer);
    }
    next();
});

app.use(cookie_parser(config.session_secret));
app.use(session({
    secret: config.session_secret,
    key: 'sap.sid',
    cookie: { path: '/', httpOnly: true, maxAge: 12 * 30 * 24 * 3600000 },
    maxAge: new Date(Date.now() + 12 * 30 * 24 * 3600000),
    secure: true,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use('/news', require('./controllers/News'));
app.use('/user', require('./controllers/User'));

app.use('/admin', express.static(__dirname + '/admin'));
app.use('/images', express.static(__dirname + '/data/images'));
app.use(express.static(__dirname + '/public'));
// app.use('/*', express.static('./data'));


app.get('/admin*', function (req, res, next) {
    const User = require('./models/User');
    if (req.session.user_id) {
        console.log(123);
        User.findOne({
            _id: mongoose.Types.ObjectId(req.session.user_id),
            is_admin: true
        }, function (err, user) {
            if (err) {
                return res.respond(err);
            }

            if (!user) {
                return res.sendFile("login.html", { root: __dirname + "/public" })
            }
            res.sendFile("admin.html", { root: __dirname + "/admin" })
        });
    } else {
        return res.sendFile("login.html", { root: __dirname + "/public" })
    }
})
app.get('/*', function (req, res, next) {
    res.sendFile("index.html", { root: __dirname + "/public" })
});

const PORT = 8087;
app.listen(PORT, function () {
    console.log('listening on ' + PORT);
    const fs = require('fs');
    if (!fs.existsSync(__dirname + '/data/')) {
        fs.mkdirSync(__dirname + '/data/');
    };
    if (!fs.existsSync(__dirname + '/data/images/')) {
        fs.mkdirSync(__dirname + '/data/images/');
    };
});

if (!module.parent) {
    mongoose.connect(config.mongo_url, { safe: false });
    mongoose.connection.on('connected', function () {
        console.log('Mongoose connected to ' + config.mongo_url + ' sucsessfully!');
    });
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose connection to ' + config.mongo_url + ' failed: ', err);
    });
}
