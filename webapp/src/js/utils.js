(function(utils) {
  
  utils.unix2date = function(unix_timestamp) {
    var date = new Date(unix_timestamp*1000);
    return stamp = date.toLocaleString();
  }

})(module.exports)
