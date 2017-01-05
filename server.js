const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const cookie_parser = require('cookie-parser');
const path = require("path");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const config = require('./config')

app.set('json spaces', 40);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(err, res, next) {
    res.respond = function(err, data) {
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

app.use('/api/news', require('./controllers/News'));
app.use('/admin', require('./controllers/admin'));

app.use('/admin', express.static(__dirname + '/admin'));
app.use('/images', express.static(__dirname + '/data/images'));
app.use(express.static(__dirname + '/public'));
// app.use('/*', express.static('./data'));


app.get('/admin', function (req, res, next) {
    res.sendFile("admin.html", { root: __dirname + "/admin" })
})
app.get('/*', function (req, res, next) {
    res.sendFile("index.html", { root: __dirname + "/public" })
});

const PORT = 8087;
app.listen(PORT, function () {
    console.log('listening on ' + PORT);
});



if (!module.parent) {
    mongoose.connect(config.mongo_url, { safe: false });
}
