var React = require('react');
var api = require('../js/api');
var config = require('../js/config');


api.new_thread({'content':'TESTER McTESTERSON'}, function(err, res) {
  api.get_thread(res.id, function(err, res) {
    console.log('RESULT');
    console.log(err);
    console.log(res);
  });
});


React.render(
  <h1>Hello, nerds!!!!</h1>,
  document.getElementById('container')
);
