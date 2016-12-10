var m_site = {
    pages: ko.observableArray([])
};

m_site.pages([
    {
        id: 'home',
        name: '',
        title: '',
        src: 'pages/Home.html'
    },
    {
        id: 'sas',
        name: 'SAS',
        title: 'sas',
        src: 'pages/Sas.html'
    }
])


$(document).ready(function(){
    var pager = new Pager($, ko);
	pager.extendWithPage(m_site);
    window.pager = pager;

    pager.useHTML5history = true;
    pager.Href5.history = History;
    pager.extendWithPage(m_site);

    ko.applyBindings(m_site);
    pager.startHistoryJs();

    pager.navigate('home');
});
