var m_news = {
    title: ko.observable(),
    lead: ko.observable(),
    items: ko.observableArray(),
    selectedCover: ko.observable({})
}
var m_news_default = Object.assign({}, m_news);

m_news.clear = function () {
    m_news.title(null);
    m_news.lead(null);
    m_news.items([]);
}

m_news.removeItem = function () {
    let index = m_news.items().indexOf(this);
    m_news.items.splice(index, 1);
}
m_news.promoteItem = function () {
    this.promoted(!this.promoted());
}
m_news.clear = function () {
    m_news.title(null);
    m_news.lead(null);
    m_news.items([]);
    m_news.selectedCover({});
}
m_news.postNews = function () {
    let formData = new FormData()
    formData.append('title', this.title())
    formData.append('lead', this.lead())

    let data = [];
    let images = [];
    this.items().forEach(function (item, index, items) {
        switch (item.name()) {
            case "rich-text":
                data.push({
                    name: 'text',
                    promoted: item.promoted(),
                    data: $(item.textField()).html()
                })
                break;
            case "variational-covers":
                let covers = item.images()
                let set = []
                covers.forEach(function (cover) {
                    delete cover.src;
                });
                data.push({
                    name: 'variationalCovers',
                    promoted: item.promoted(),
                    data: covers
                });
                let files = item.inputField().files
                for (file of files) {
                    set.push(file);
                }
                images.push({
                    number: index,
                    promoted: item.promoted(),
                    set: set
                });
                break;
            case "youtube":
                data.push({
                    name: 'youtube',
                    promoted: item.promoted(),
                    data: item.src()
                })
                break;
        }
    })
    console.log(data);
    console.log(images);
    formData.append('items', JSON.stringify(data))
    images.forEach(function (imageset, index) {
        let set = imageset.set;
        set.forEach(function (image, index, set) {
            formData.append('imageset-covers#' + imageset.number + [], image);
        })
    })
    //
    Send.formData('/news/create', formData, function (err, answer) {
        if (err) {
            console.log(err);
            return Materialize.toast('Ошибка: ' + err, 5000, 'errored');
        }
        Materialize.toast(answer, 5000);
        m_news.clear();
    })
}
