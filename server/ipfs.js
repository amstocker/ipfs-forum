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

  function update(key, thread, callback) {
    async.waterfall([
      // insert IPFS object
      function(cb) {
        api.add(new Buffer(JSON.stringify(thread)), cb);
      },
      // set current head pointer in DHT
      function(res, cb) {
        var metadata = JSON.stringify({
          'multihash': res[0].Hash,
          'id': thread.id,
          'created_utc': thread.created_utc,
          'latest_utc': thread.latest_utc
        });
        api.dht.put(key, metadata, cb);
      },
      // test DHT get
      //function(res, cb) {
      //  api.dht.get(key, cb);
      //}
    ], function(err, res) {
      callback(err, thread);
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

    update(key, thread_data, callback);
  }


  ipfs.get_thread_meta = function(prefix, thread_id, callback) {
    // attempt to get current head from DHT
    api.dht.get(dht_key(prefix, thread_id), function(err, res) {
      callback(err, JSON.parse(res));
    });
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
        var mh = JSON.parse(res).multihash;
        api.cat([mh], function(err, res) {
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
        update(key, res, cb);
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


  // http://stackoverflow.com/questions/14458508/node-js-shell-command-execution
  function cmd_exec(cmd, args, cb_stdout, cb_end) {
    var spawn = require('child_process').spawn,
      child = spawn(cmd, args),
      me = this;
    me.exit = 0;  // Send a cb to set 1 when cmd exits
    child.stdout.on('data', function (data) { cb_stdout(me, data) });
    child.stdout.on('end', function () { cb_end(me) });
  }

  ipfs.repo_gc = function() {
    exec = new cmd_exec('ipfs', ['repo','gc'],
      function (me, data) {
        if (data && !(data == undefined)) {
          me.stdout += data.toString();
        }
      },
      function (me) {
        me.exit = 1;
        console.log('===REPO-GC===');
        console.log(exec.stdout);
        console.log('=============');
      }
    );
  }

})(module.exports)
