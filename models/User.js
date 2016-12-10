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
    login: String,
    password: String
};

const UserSchema = new Schema(UserProps);
UserSchema.statics.hashPassword = hashPassword;

const User = mongoose.model('User', UserSchema);

console.log(User.hashPassword);

module.exports = User;
