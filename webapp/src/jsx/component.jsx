var React = require('react');
var api = require('../js/api');
var utils = require('../js/utils');


(function(component) {

  var App = component.App = React.createClass({
    getInitialState: function() {
      return {
        thread: null,
        error: null
      };
    },
    componentDidMount: function() {
      if (window.location.hash) {
        var thread_id = window.location.hash.substring(1);
        
        api.get_thread(thread_id, function(err, res) {
          if (err) {
            return this.setState({
              thread: null,
              error: err
            });
          }
          return this.setState({
            thread: res,
            error: null
          });
        }.bind(this));
      }
    },
    render: function() {
      if (this.state.thread) {
        return (
          <Thread data={this.state.thread} />
        );
      }
      return (
        <ApiError message={this.state.error} />
      );
    }
  });
 


  var Thread = component.Thread = React.createClass({
    render: function() {
      var commentList = this.props.data.comments.map(function(comment) {
        return (
          <Comment data={comment} />
        );
      });
      return (
        <div className="Thread">
          <Header data={this.props.data} />
          {commentList}
        </div>
      );
    }
  });


  var Header = component.Header = React.createClass({
    render: function() {
      return (
        <div className="Header">
          <div>{"created: " + utils.unix2date(this.props.data.created_utc)}</div>
          <div>{"content: " + this.props.data.content}</div>
        </div>
      );
    }
  });


  var Comment = component.Comment = React.createClass({
    render: function() {
      return (
        <div className="Comment">
          <div>{"created: " + utils.unix2date(this.props.data.created_utc)}</div>
          <div>{"content: " + this.props.data.content}</div>
        </div>
      );
    }
  });


  //var ReplyBox = component.ReplyBox = React.createClass({
  //});

  var ApiError = component.ApiError = React.createClass({
    render: function() {
      return (
        <div className="ApiError">
          <div>{"API Error:"}</div>
          <div>{this.props.message}</div>
        </div>
      );
    }
  });

})(module.exports)
