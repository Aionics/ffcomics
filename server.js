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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser({
  uploadDir: path.join(__dirname, '../public/upload/temp')
}));
app.use(cookie_parser(config.session_secret));
app.use(session({
    secret: config.session_secret,
    key: 'sap.sid',
    cookie: {path: '/', httpOnly: true, maxAge: 12 * 30 * 24 * 3600000},
    maxAge: new Date(Date.now() + 12 * 30 * 24 * 3600000),
    secure: true,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

app.use('/admin', require('./controllers/admin'));
app.use('/admin', express.static('./admin'));
app.use('/admin', express.static('./resources'));
app.get('/admin', function(req, res, next) {
    res.sendFile("admin.html", { root: __dirname + "/admin"} )
})


app.use('/', express.static('./public'));
app.use('/admin', express.static('./resources'));
app.get('/*', function (req, res, next) {
    res.sendFile("index.html", { root: __dirname + "/public"} )
});

const PORT = 8087;
app.listen(PORT, function () {
    console.log('listening on ' + PORT);
});

if (!module.parent) {
    mongoose.connect(config.mongo_url, {safe: false});
}
