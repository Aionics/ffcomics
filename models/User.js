const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const hashPassword = function(password) {
    let hash = crypto.createHash('sha1')
        .update(password)
        .digest('hex');

    return hash;
};

var User = new Schema({
    login: {type: String},
    password: {type: String}
});

module.exports = User;
