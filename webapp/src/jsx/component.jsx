var React = require('react');
var api = require('../js/api');
var utils = require('../js/utils');


(function(component) {

  var App = component.App = React.createClass({
    getInitialState: function() {
      return {
        thread: null
      };
    },
    componentDidMount: function() {
      if (window.location.hash) {
        var thread_id = window.location.hash.substring(1);
        
        api.get_thread(thread_id, function(err, res) {
          if (err) {
            return this.setState({
              thread: null
            });
          }
          return this.setState({
            thread: res
          });
        }.bind(this));
      }
    },
    render: function() {
      if (this.state.thread) {
        var metadata = this.state.thread;
        var comments = this.state.thread.comments;
        return (
          <Thread metadata={metadata} comments={comments} />
        );
      }
      return (
        <LoadError message={"API Error"} />
      );
    }
  });
 


  var Thread = component.Thread = React.createClass({
    render: function() {
      var commentList = this.props.comments.map(function(comment) {
        return (
          <Comment data={comment} />
        );
      });
      return (
        <div className="Thread">
          <Header data={this.props.metadata} />
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

  var LoadError = component.LoadError = React.createClass({
    render: function() {
      return (
        <div className="LoadError">{"ERROR: " + this.props.message}</div>
      );
    }
  });

})(module.exports)
