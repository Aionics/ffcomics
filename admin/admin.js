var m_admin = {
    pages: ko.observableArray([])
};

m_admin.pages([
    {
        id: 'login',
        name: '',
        title: '',
        src: 'pages/Login.html'
    }
])


var m_auth = {
    login: ko.observable(),
    password: ko.observable()
};

m_auth.authorize = function () {
    var data = {
        login: m_auth.login(),
        password: m_auth.password()
    }

    Server.post('/admin/auth', data, function (err, response) {
        if (err) {
            return console.log('login error: ', err);
        }
        console.log(response);
    })
};

$(document).ready(function(){
    var pager = new Pager($, ko);
	pager.extendWithPage(m_admin);

    pager.useHTML5history = true;
    pager.Href5.history = History;
    pager.extendWithPage(m_admin);

    window.pager = pager;

    ko.applyBindings(m_admin);
    pager.startHistoryJs();

    pager.navigate('login');
});
