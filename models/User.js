const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const hashPassword = function(password) {
    let hash = crypto.createHash('sha1')
        .update(password)
        .digest('hex');

    return hash;
};

const UserProps = {
    all: {
        login: {type: String},
        password: {type: String}
    }
};

const UserSchema = new Schema(UserProps.all);
UserSchema.static.hashPassword = hashPassword;

const User = mongoose.model('User', UserSchema);


module.exports = User;
