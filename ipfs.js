var config = require('./config');
var ipfsAPI = require('ipfs-api');
var uuid = require('uuid');
var async = require('async');


(function(ipfs) {

  ipfs.api = api = ipfsAPI(config.ipfs_host, config.ipfs_port);


  function dht_key(prefix, multihash) {
    return prefix + '::' + multihash;
  }

  function add(key, data, callback) {
    async.waterfall([
      // insert IPFS object
      function(cb) {
        api.add(new Buffer(JSON.stringify(data)), cb);
      },
      // set current head pointer in DHT
      function(res, cb) {
        api.dht.put(key, res[0].Hash, cb);
      },
      // test DHT get
      function(res, cb) {
        api.dht.get(key, cb);
      }
    ], function(err, res) {
      callback(err, data);
    });
  }


  ipfs.new_thread = function(prefix, thread, callback) {
    // id which will use to store current head pointer in the DHT
    var id = uuid.v4();
    // use prefix for DHT key in order to not pollute
    var key = dht_key(prefix, id);

    var now = new Date().getTime()/1000;
    var data = {
      'id': id,
      'dht_prefix': prefix,
      'created_utc': now,
      'latest_utc': now,
      'title': thread.title,
      'content': thread.content,
      'comments': []
    };

    add(key, data, callback);
  }


  ipfs.get_thread_addr = function(prefix, thread_id, callback) {
    // attempt to get current head from DHT
    api.dht.get(dht_key(prefix, thread_id), callback);
  }


  ipfs.append_comment = function(prefix, thread_id, comment, callback) { 
    var now = new Date().getTime()/1000;
    var key = dht_key(prefix, thread_id);
    var comment_data = {
      'created_utc': now,
      'content': comment.content
    };
    // Get old object, update with comment info, then update head pointer
    // in the DHT
    async.waterfall([
      function(cb) {
        api.dht.get(dht_key, cb);
      },
      function(res, cb) {
        api.cat([res], function(err, res) {
          if (err || !res) {
            return cb(err, null);
          }
          if (res.readable) {
            return handle_stream(res, cb);
          } else {
            return cb(null, res);
          }
        });
      },
      function(thread, cb) {
        try {
          thread.comments.push(comment_data);
          thread.latest = now;
          cb(null, thread);
        }
        catch(e) {
          cb(e, null);
        }
      },
      function(res, cb) {
        add(key, res, cb);
      }
    ], function(err, res) {
      return callback(err, comment_data);
    });
  }

  function handle_stream(stream, callback) {
    var res = [];
    stream.on('data', function(buffer) {
      res.push(JSON.parse(buffer.toString()));
    });
    stream.on('end', function() {
      callback(null, res[0]);
    });
  }

})(module.exports)
