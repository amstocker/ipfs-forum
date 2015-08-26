exports = module.exports = (function(wrap) {
  return function(app) {
    wrap(app);
    return app;
  };
})(function(app) {ipfs.id(function(_err, _res) {

// multihash of local IPFS instance
var IPFS_ID = _res.ID;


/**
 * API endpoints
 **/
var config  = require('./config');
var ipfsAPI = require('ipfs-api');

// make global ipfs context
ipfs = ipfsAPI(config.ipfs_host, config.ipfs_port);



app.get(config.api_base + "thread", function(http_req, http_res) {

});

app.post(config.api_base + "thread", function(http_req, http_res) {

});

app.post(config.api_base + "comment", function(http_req, http_res) {
  
  // TODO: Web client needs to be responible for determining the 'size'
  // of the data, which could just be the length of this stringified json.
  
  // From testing... the go-ipfs client stores size=length(string)+9 bytes
  // for whatever encoding it uses.
  
  var data = JSON.stringify({
    'content':      http_req.body.content,
    'created_utc':  new Date().getTime()/1000,
    'publisher':    IPFS_ID,
    'type':         "COMMENT"
  });

  var ipfsObj = new Buffer(JSON.stringify({
    'Links': [{
      'Name': "parent",
      'Hash': http_req.body.parent_hash,
      'Size': http_req.body.parent_size
    }],
    'Data': data
  }));
  
  
  ipfs.object.put(ipfsObj, 'json', function(ipfs_err, ipfs_res) {
    if (ipfs_err) {
      http_res.status(400).send({error: ipfs_err}); 
    }
    http_res.append('X-Multihash', ipfs_res.Hash);

    /**
     * TODO: notify other nodes, coordinate verifying list of posts, etc...
     *  -> For now just store list in the DHT.
     **/
    dht_key = IPFS_DHT_PREFIX + http_req.body.thread_hash;

    ipfs.dht.get(dht_key, function(dht_get_err, dht_get_res) {
      hash_list = JSON.parse(dht_get_res);
      hash_list.push(ipfs_res.Hash);

      ipfs.dht.put(dht_key, JSON.stringify(hash_list), function(e,r){
        http_res.json('{}');
      });
    });
  });

});




})});
