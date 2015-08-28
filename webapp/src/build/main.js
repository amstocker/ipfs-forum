var React = require('react');


var TEST_API = 'http://ipfs.andrewstocker.net/api/v0/';


function post(url, data, callback) {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      callback(JSON.parse(xmlhttp.responseText));
    }
  };
  xmlhttp.open('POST', url, true);
  
  xmlhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
  xmlhttp.send(JSON.stringify(data));
}


var data = {
  'dht_prefix': 'TEST-CONTENT',
  'thread': {
    'content': 'TEST TEST TEST'
  }
};

post(TEST_API + 'thread', data, function(res) {console.log(res)});


React.render(
  React.createElement("h1", null, "Hello, nerds!!!!"),
  document.getElementById('container')
);
