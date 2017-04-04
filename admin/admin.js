var m_admin = {
    pages: ko.observableArray([]),
    user: ko.observable(),
    sidebarToggle: ko.observable(false)
};

m_admin.pages([
    {
        id: 'news',
        name: 'Новости',
        src: 'pages/News.html'
    }
])
m_admin.logout = function() {
    Send.post('/user/logout', {}, function (err, answer) {
        if (err) {
            return console.error('load news faild: ', err);
        }
        location.reload();
    })
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

});
