var React = require('react');
var api = require('../js/api');
var config = require('../js/config');
var component = require('./component');


var test = {
  'title': "too much netflix",
  'content': "TEST TEST TEST"
}

api.new_thread(test, function(err, res) {
  if (err) {
    return console.log(err);
  }

  window.location.hash = res.id;
  
  React.render(
    <component.App />,
    document.getElementById('container')
  );
});
