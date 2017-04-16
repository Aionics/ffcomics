ko.bindingHandlers.richText = {
    init: function (element, valueAccessor) {
        let value = valueAccessor();
        let quill = new Quill(element, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }, { 'direction': 'rtl' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            },
            history: {
                'delay': 2500,
                'userOnly': true
            }
        });
        value(quill.root);
    }
};
ko.bindingHandlers.files = {
    init: function (element, valueAccessor) {
        let inputField = valueAccessor().inputField;
        let images = valueAccessor().images;

        inputField(element);

        $(element).change(function () {
            let files = element.files;
            images([]);
            for (file of files) {
                let reader = new FileReader();
                reader.onloadend = function() {
                    images.push({
                        src: reader.result
                    })
                };
                reader.readAsDataURL(file);
            }
        });
    }
};
