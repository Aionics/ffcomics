module.exports = {
    checkIsAdmin: function (req, res, next) {
        const User = require('./models/User');
        const mongoose = require('mongoose');

        if (req.session.user_id) {
            User.findOne({
                _id: mongoose.Types.ObjectId(req.session.user_id),
                is_admin: true
            }, function (err, user) {
                if (err) {
                    return res.respond(err);
                }

                if (!user) {
                    return res.respond('You are not an admin. If you are, try to relog');
                }
                next();
            });
        } else {
            return res.respond('you need to log in');
        }
    }
}
