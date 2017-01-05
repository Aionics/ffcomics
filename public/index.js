var m_site = {
    pages: ko.observableArray([]),
    news: ko.observableArray([]),
    selectedNews: ko.observable(new News({}))
};

m_site.selectNews = function (item) {
    m_site.selectedNews(item);
}

m_site.pages([{
        id: 'home',
        nav_name: '',
        title: '',
        src: 'pages/Home.html',
    },
    {
        id: 'sas',
        nav_name: 'SAS',
        title: 'sas',
        src: 'pages/Sas.html'
    }
])

function preloadNews() {
    Server.post('api/news', {}, function (err, news) {
        if (err) {
            return console.error('load news faild: ', err);
        }

        news.forEach(function (_news) {
            m_site.news.push(new News(_news));
        })
        m_site.selectedNews(m_site.news()[0]);
    })
}

$(document).ready(function () {
    var pager = new Pager($, ko);
    pager.extendWithPage(m_site);
    window.pager = pager;

    pager.useHTML5history = true;
    pager.Href5.history = History;
    pager.extendWithPage(m_site);

    ko.applyBindings(m_site);
    pager.startHistoryJs();

    pager.navigate('home');
    preloadNews();
});
