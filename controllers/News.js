const express = require('express');
const mongoose = require('mongoose');
const Busboy = require('busboy');
const transliterate = require('transliterate');
const api = express();

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


api.post('/create', checkIsAdmin, function(req, res) {
    console.log(req.body);
    let {title, lead, text} = req.body;

    let busboy = new Busboy({
        headers: req.headers
    });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

        var saveTo = path.join(__dirname, '../public/resources/' + transliterate(title).replace(' ', '_') + '.' + mimetype);
        console.log(saveTo);
    //   file.pipe(fs.createWriteStream(saveTo));
    });

    req.pipe(busboy);
});

module.exports = api;



    // var busboy = new Busboy({ headers: req.headers });
    // busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //   var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
    //   file.pipe(fs.createWriteStream(saveTo));
    // });
    //
    // busboy.on('finish', function() {
    //   res.writeHead(200, { 'Connection': 'close' });
    //   res.end("That's all folks!");
    // });
