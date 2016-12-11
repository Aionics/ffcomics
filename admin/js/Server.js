var Server = (function(){
    var _request = function(method){
        return function(url, data, done){
            console.log('sending data: ', JSON.stringify(data));
            var response = $.ajax({
                url: url,
                type: method,
                data: JSON.stringify(data),
                dataType: 'JSON',
                contentType: 'application/json',
                success: function(message) { done(message.err, message.data); },
                error: function(xhr, status, err) {
                    console.log('network error: ', status, err);
                }
            });
            return response;
        };
    };
    var Server = {
        get: _request('get'),
        post: _request('post'),
    };
    return Server;
})();
