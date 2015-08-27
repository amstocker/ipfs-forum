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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


/**
 * Routes
 **/
app.get(config.api_base + 'thread', function(req, res) {
  ipfs.get_thread_addr(
      req.body.dht_prefix,
      req.body.thread_id,
      function(err, multihash) {
        if (err) {
          return res.status(500).send({error: err});
        }
        return res.json({'Hash': multihash});
      }
  );
})

app.post(config.api_base + 'thread', function(req, res) {
  var thread = {
    'title': req.body.thread_title,
    'content': req.body.thread_content
  };
  ipfs.new_thread(
      req.body.dht_prefix,
      thread,
      function(err, thread_data) {
        if (err) {
          return res.status(500).send({error: err});
        }
        return res.json(thread_data);
      }
  );
})

app.post(config.api_base + 'comment', function(req, res) {
  var comment = {
    'content': req.body.comment_content
  };
  ipfs.append_comment(
      req.body.dht_prefix,
      req.body.thread_id,
      comment,
      function(err, comment_data) {
        if (err) {
          return res.status(500).send({error: err});
        }
        return res.json(comment_data);
      }
  );
})


/**
 * Start server
 **/
var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at: http://%s:%s', host, port);
});
