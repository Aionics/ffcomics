module.exports = {
    session_secret: 'djigurda',
    mongo_url: 'mongodb://localhost/ffcomics'
}

// app.use('/createadmin', function () {
//     const User = require('./models/User');
//     let user = {
//         login: 'Aionics',
//         password: User.hashPassword('pizda'),
//         is_admin: true
//     }
//     User.create(user, function () {
//         console.log('created user: ', user);
//     });
// })
