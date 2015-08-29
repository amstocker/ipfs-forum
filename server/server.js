var config  = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var ipfs = require('./ipfs');


var app  = express();

/**
 * Config
 **/
if (config.serve_static) {
  console.log('Serving static content from: %s', config.static_folder);
  
  app.use(express.static(config.static_folder));
}

if (config.behind_reverse_proxy) {
  console.log('Serving behind a reverse proxy');

  app.set('trust proxy', 'loopback');
}

if (config.enable_cors) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


/**
 * Routes
 **/
function error_or_json(res) {
  // return callback
  return function(ipfs_err, ipfs_res) {
    if (ipfs_err) {
      return res.status(500).send({error: ipfs_err});
    }
    return res.json(ipfs_res);
  }
}

app.get(config.api_base + 'thread', function(req, res) {
  console.log('GET /thread');
  console.log(req.body);
  ipfs.get_thread_meta(
      req.body.dht_prefix,
      req.body.thread_id,
      error_or_json(res)
  );
})

app.post(config.api_base + 'thread', function(req, res) {
  console.log('POST /thread');
  console.log(req.body);
  ipfs.new_thread(
      req.body.dht_prefix,
      req.body.thread,
      error_or_json(res)
  );
})

app.post(config.api_base + 'comment', function(req, res) {
  console.log('POST /comment');
  console.log(req.body);
  ipfs.append_comment(
      req.body.dht_prefix,
      req.body.thread_id,
      req.body.comment,
      error_or_json(res)
  );
})


/**
 * Start and listen
 **/
var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at: http://%s:%s', host, port);
});


/**
 * Schedule IPFS repo garbage collection
 **/
setInterval(ipfs.repo_gc, config.ipfs_repo_gc_interval * 60 * 1000);
