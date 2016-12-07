var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var path = require("path");

app.set('json spaces', 40);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('./public'));
app.get('/*', function (req, res, next) {
    res.sendFile("index.html", { root: __dirname + "/public"} )
});

const PORT = 8086;
app.listen(PORT, function () {
    console.log('listening on ' + PORT);
});
