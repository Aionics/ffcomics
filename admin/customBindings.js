ko.bindingHandlers.richText = {
    init: function (element, valueAccessor) {
        value = valueAccessor()
        quill = new Quill(element, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }, { 'direction': 'rtl' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image', ],
                    ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            },
            history: {
                'delay': 2500,
                'userOnly': true
            },
        });
        value(quill.root);
    }
}
