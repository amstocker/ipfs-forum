var config = require('./config');
var ipfs   = require('ipfs-api')(config.ipfs_host, config.ipfs_port);


module.exports = exports = function() {

  function dht_key(prefix, multihash) {
    return prefix + multihash;
  }


  this.new_thread(prefix, thread_mh, callback) {
    
    var obj = JSON.stringify({
      'original': thread_mh,
      'created_utc': new Date().getTime()/1000,
      'comments': [],
      'current_head': thread_mh
    });

    ipfs.dht.put(dht_key(prefix, thread_mh), 

  }

  this.get_comments(prefix, thread, callback) {
 
  }

  this.append_comment(prefix, thread, comment, callback) {
  
  }

}
