var m_auth = {
    login: ko.observable(),
    password: ko.observable()
};

m_auth.authorize = function () {
    var data = {
        login: m_auth.login(),
        password: m_auth.password()
    }

    Send.post('/user/auth', data, function (err, user) {
        if (err) {
            return Materialize.toast('Ошибка: ' + err, 5000, 'errored')
        }
        window.location = "/admin"
    })
};

$(document).ready(function(){
    ko.applyBindings(m_auth);
});
