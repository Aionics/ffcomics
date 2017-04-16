var RichText = function(params) {
    var self = this

    this.name = ko.observable('rich-text')
    this.promoted = ko.observable(false)
    this.textField = ko.observable()
}
