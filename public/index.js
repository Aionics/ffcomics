var m_site = {
};


$(document).ready(function(){
    var pager = new Pager($, ko);
	pager.extendWithPage(m_site);
    
    pager.useHTML5history = true;
    pager.Href5.history = History;
    pager.extendWithPage(viewModel);

    ko.applyBindings(m_site);
    pager.startHistoryJs();
});
