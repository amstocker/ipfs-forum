var config = require('../config');
var async  = require('async');
var ipfs   = require('ipfs-api')(config.ipfs_host, config.ipfs_port);


module.exports = exports = function(http_req, http_res) {

  async.waterfall([
    // make IPFS object
    function(callback) {
      try {
        var data = JSON.stringify({
          'content':      http_req.body.content,
          'created_utc':  new Date().getTime()/1000,
          'publisher':    IPFS_ID,
          'type':         "COMMENT"
        });
        var obj = new Buffer(JSON.stringify({
          'Links': [{
            'Name': "parent",
            'Hash': http_req.body.parent_hash,
            'Size': http_req.body.parent_size
          }],
          'Data': data
        }));
        callback(null, obj);
      }
      catch(e) {
        callback(e);
      }
    },
    //
  ], function(err, result) {
  
  });

});
