var React = require('react');
var api = require('../js/api');
var config = require('../js/config');


api.new_thread({'content':'TESTER McTESTERSON'}, function(err, res) {
  api.get_thread(res.id, function(err, res) {
    if (err) {console.log(err)}
    console.log('GET TEST', res);
    api.new_comment(res.id, {'content':'TESTY TESTERS'}, function(err, res) {
      if (err) {console.log(err)}
      console.log('COMMENT TEST', res);
      api.get_thread(res.id, function(err, res) {
        if (err) {console.log(err)}
        console.log('GET TEST', res);
      });
    });
  });
});


React.render(
  <h1>Hello, nerds!!!!</h1>,
  document.getElementById('container')
);
