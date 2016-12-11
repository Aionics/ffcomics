var m_admin = {
    pages: ko.observableArray([]),
    user: ko.observable()
};

m_admin.pages([
    {
        id: 'login',
        name: '',
        src: 'pages/Login.html'
    },
    {
        id: 'news',
        name: 'Новости',
        src: 'pages/News.html'
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

    Server.post('/admin/auth', data, function (err, user) {
        if (err) {
            return console.log('login error: ', err);
        }
        m_admin.user(user);
        pager.navigate('/admin');
    })
};

m_createNews = {
    title: ko.observable(),
    lead: ko.observable(),
    text: ko.observable(),
    file: ko.observable()
}

m_admin.load = function (id) {
    console.log(id);
}

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
