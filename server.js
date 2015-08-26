var config  = require('./config');
var express = require('express');
var bodyParser = require('body-parser');


var app  = express();

app.get( config.api_base + 'thread',  require('./handlers/thread_get'));
app.post(config.api_base + 'thread',  require('./handlers/thread_post'));
app.post(config.api_base + 'comment', require('./handlers/comment'));



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


var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at: http://%s:%s', host, port);
});
