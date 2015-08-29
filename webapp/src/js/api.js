var config = require('./config');


(function(api) {
  
  api.get_thread = function(thread_id, callback) {
    api.get_thread_meta(thread_id, function(err, res, xhr) {
      if (err) {
        return callback(err, null, xhr);
      }
      gateway_json(res.multihash, callback);
    });
  }

  api.get_thread_meta = function(thread_id, callback) {
    var object = {
      'dht_prefix': config.dht_prefix,
      'thread_id': thread_id
    }
    api.get('/thread', object, callback);
  }

  api.new_thread = function(thread, callback) {
    var object = {
      'dht_prefix': config.dht_prefix,
      'thread': thread
    }
    api.post('/thread', object, callback);
  }

  api.new_comment = function(thread_id, comment, callback) {
    var object = {
      'dht_prefix': config.dht_prefix,
      'thread_id': thread_id,
      'comment': comment
    }
    api.post('/comment', object, callback);
  }


  
  api.get = function(path, object, callback) {
    api_req('GET', path, object, callback);
  }

  api.post = function(path, object, callback) {
    api_req('POST', path, object, callback);
  }



  function api_req(method, path, object, callback) {
    json(method, config.api_base + path, object,
      function(res, xhr) {
        callback(null, res, xhr);
      },
      function(xhr) {
        callback(xhr.status, null, xhr);
      }
    );
  }

  
  function gateway_json(multihash, callback) {
    json('GET', config.gateway_base + multihash, null,
      function(res, xhr) {
        return callback(null, res, xhr);
      },
      function(xhr) {
        return callback(xhr.status, null, xhr);
      }
    );
  }


  function json(method, url, object, s, e) {
    xhr = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var res = null;
          try {
            res = JSON.parse(xhr.responseText);
          } catch(e) {
            res = xhr.responseText;
          }
          return s(res, xhr);
        }
        return e(xhr);
      }
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    
    object ? xhr.send(JSON.stringify(object)) : xhr.send();
  }


})(module.exports)
