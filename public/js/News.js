function News(initObj) {
    this.title = ko.observable(initObj.title);
    this.lead = ko.observable(initObj.lead);
    this.text = ko.observable(initObj.text);
    this.src = ko.observable(initObj.img);
}
