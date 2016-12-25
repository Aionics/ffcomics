var Server = (function(){
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
            var file = $('#' + data.file)[0].files[0]
            console.log('file: ', file)

            
            var formData = new FormData();
            formData.append(data.file, file);
            delete data.file;
            for (prop in data) {
                formData.append(prop, data[prop]);                
            }
            console.log('sending data: ', formData);
            var response = $.ajax({
                url: url,
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function(message) {
                    console.log('recieved: ', message);
                    done(message.err, message.data);
                },
                error: function(xhr, status, err) {
                    console.log('network error: ', status, err);
                }
            })
            return response;
        };
    };
    var Server = {
        get: _request('get'),
        post: _request('post'),
        files: _files('post')
    };
    return Server;
})();
