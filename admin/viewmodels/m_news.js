var m_news = {
    title: ko.observable(),
    lead: ko.observable(),
    text: ko.observable(),
    fileData: ko.observable({
        file: ko.observable(),
        fileArray: ko.observableArray(),
        dataURLArray: ko.observableArray(),
    }),
    selectedImages: ko.observableArray(),
    test: ko.observable()
}
var m_news_default = Object.assign({}, m_news);

m_news.clear = function () {
    m_news.title(null);
    m_news.lead(null);
    m_news.text(null);
    m_news.selectedImages([]);
    m_news.fileData().clear();
}

m_news.selectImage = function (file) {
    var indexOf = m_news.selectedImages().indexOf(file)
    if (indexOf === -1) {
        m_news.selectedImages.push(file);
    } else {
        m_news.selectedImages.splice(indexOf, 1);
    }
}

m_news.create = function () {
    var selectedImages = [];
    m_news.fileData().fileArray().forEach(function (image, index) {
        m_news.selectedImages().forEach(function (selectedImage) {
            if (image == selectedImage) {
                selectedImages.push(index);
            }
        });
    });
    var data = {
        title: m_news.title(),
        lead: m_news.lead(),
        text: m_news.text(),
        selectedImages: selectedImages,
        images: m_news.fileData().fileArray(),
    }
    Send.files('/api/news/create', data, function (err, data) {
        if (err) {
            Materialize.toast('Ошибка: ' + err, 5000, 'errored')
            return console.log('create news: ', err);
        }
        Materialize.toast('Новость создана!', 5000)
        m_news.clear()
    });
}
