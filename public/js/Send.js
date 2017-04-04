var Send = (function(){
    var _request = function(method){
        return function(url, data, done){
            console.log('sending data: ', data);
            var response = $.ajax({
                url: url,
                type: method,
                data: JSON.stringify(data),
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(message) {
                    console.log('recieved: ', message);
                    done(message.err, message.data);
                },
                error: function(xhr, status, err) {
                    console.log('network error: ', status, err);
                }
            });
            return response;
        };
    };
    var _files = function(method, contentType, dataType){
        return function(url, data, done){
            var formData = new FormData();
            var file = {
                file: $('#' + data.file)[0].files[0],
                name: data.file
            }
            delete data.file;
            for (prop in data) {
                formData.append(prop, data[prop]);
            }
            formData.append(file.name, file.file);
            console.log('sending data: ', formData);
            var response = $.ajax({
                url: url,
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function(answer) {
                    console.log('recieved: ', answer);
                    done(answer.err, answer.data);
                },
                error: function(xhr, status, err) {
                    console.log('network error: ', status, err);
                }
            })
            return response;
        };
    };
    var Send = {
        get: _request('get'),
        post: _request('post'),
        files: _files('post')
    };
    return Send;
})();
