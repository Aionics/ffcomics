function News(initObj) {
    this.title = ko.observable(initObj.title);
    this.lead = ko.observable(initObj.lead);
    this.text = ko.observable(initObj.text);
    this.id = ko.observable(initObj._id);
    this.images = ko.observableArray(initObj.images);
}
