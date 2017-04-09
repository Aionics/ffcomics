var m_news = {
    title: ko.observable(),
    lead: ko.observable(),
    images: ko.observableArray([
        'https://s-media-cache-ak0.pinimg.com/originals/84/5d/dd/845dddbe279df169328c284ca9db7c1f.jpg',
        'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/504493/504493._SX1280_QL80_TTD_.jpg',
        'https://s-media-cache-ak0.pinimg.com/originals/d3/d8/be/d3d8be656f64bc57a66691649bfc9873.jpg',
        'https://s-media-cache-ak0.pinimg.com/originals/84/5d/dd/845dddbe279df169328c284ca9db7c1f.jpg',
        // 'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/504493/504493._SX1280_QL80_TTD_.jpg',
        // 'https://s-media-cache-ak0.pinimg.com/originals/d3/d8/be/d3d8be656f64bc57a66691649bfc9873.jpg',
    ]),
    items: ko.observableArray()
}
var m_news_default = Object.assign({}, m_news);

m_news.clear = function () {
    m_news.title(null);
    m_news.lead(null);
    m_news.items([]);
}

m_news.removeItem = function () {
    let index = m_news.items().indexOf(this);
    console.log(index);
    m_news.items.splice(index, 1);
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
