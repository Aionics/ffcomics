var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var path = require("path");

app.set('json spaces', 40);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/', express.static('./public'));
app.get('/*', function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    //This becouse i want your real ip c:
    console.log('Got a connection from ' + ip + ' gonna show him this page:' + req.protocol + '://' + req.get('host') + req.originalUrl);
    // res.sendFile("index.html", { root: __dirname + "/public" })
});

const PORT = 8087;
app.listen(PORT, function () {
    console.log('123');
    console.log('listening on ' + PORT);
});
