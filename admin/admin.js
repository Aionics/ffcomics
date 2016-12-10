var m_admin = {
};


$(document).ready(function(){
    var pager = new Pager($, ko);
	pager.extendWithPage(m_admin);

    pager.useHTML5history = true;
    pager.Href5.history = History;
    pager.extendWithPage(m_admin);

    ko.applyBindings(m_admin);
    pager.startHistoryJs();
});
