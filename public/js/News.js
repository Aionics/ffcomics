function News(initObj) {
    this.title = ko.observable(initObj.title);
    this.lead = ko.observable(initObj.lead);
    this.items = ko.observableArray(initObj.items);
}
