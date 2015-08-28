var config = require('./config');
var ipfsAPI = require('ipfs-api');
var uuid = require('uuid');
var async = require('async');
var extend = require('extend');

(function(ipfs) {

  ipfs.api = api = ipfsAPI(config.ipfs_host, config.ipfs_port);


  function dht_key(prefix, id) {
    return prefix + '::' + id;
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
      //function(res, cb) {
      //  api.dht.get(key, cb);
      //}
    ], function(err, res) {
      callback(err, data);
    });
  }


  ipfs.new_thread = function(prefix, thread_data, callback) {
    // id which will be used to store current head pointer in the DHT
    var id = uuid.v4();
    // use prefix for DHT key in order to not pollute namespace
    var key = dht_key(prefix, id);
    var now = new Date().getTime()/1000;
    extend(thread_data, {
      'id': id,
      'dht_key': key,
      'dht_prefix': prefix,
      'created_utc': now,
      'latest_utc': now,
      'comments': []
    });

    add(key, thread_data, callback);
  }


  ipfs.get_thread_addr = function(prefix, thread_id, callback) {
    // attempt to get current head from DHT
    api.dht.get(dht_key(prefix, thread_id), callback);
  }


  ipfs.append_comment = function(prefix, thread_id, comment_data, callback) { 
    var now = new Date().getTime()/1000;
    var key = dht_key(prefix, thread_id);
    extend(comment_data, {
      'created_utc': now,
    });
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
      function(res, cb) {
        try {
          var thread = res[0];
          thread.comments.push(comment_data);
          thread.latest_utc = now;
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
      callback(null, res);
    });
  }

})(module.exports)
