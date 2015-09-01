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
    submitHandler: function(comment) {
      if (this.state.thread) {
        api.new_comment(this.state.thread.id, comment, function(err, res) {
          if (err) {
            return console.log(err);
          }
          window.location.reload();
        });
      }
    },
    render: function() {
      if (this.state.thread) {
        return (
          <Thread data={this.state.thread} submitHandler={this.submitHandler} />
        );
      }
      return (
        <ApiError message={this.state.error} />
      );
    }
  });
 


  var Thread = component.Thread = React.createClass({
    render: function() {
      var commentList = this.props.data.comments.map(function(comment, index) {
        return (
          <Comment key={index} data={comment} />
        );
      });
      return (
        <div className="Thread">
          <ThreadHeader data={this.props.data} />
          <ReplyBox submitHandler={this.props.submitHandler} />
          {commentList}
        </div>
      );
    }
  });


  var ThreadHeader = component.ThreadHeader = React.createClass({
    render: function() {
      return (
        <div className="ThreadHeader">
          <div><i>{"created: " + utils.unix2date(this.props.data.created_utc)}</i></div>
          <div>{this.props.data.content}</div>
        </div>
      );
    }
  });


  var Comment = component.Comment = React.createClass({
    render: function() {
      return (
        <div className="Comment">
          <CommentHeader data={this.props.data} />
          <div>{this.props.data.content}</div>
        </div>
      );
    }
  });


  var CommentHeader = component.CommentHeader = React.createClass({
    render: function() {
      return (
        <div className="CommentHeader">
          <i>{"created: " + utils.unix2date(this.props.data.created_utc)}</i>
        </div>
      );
    }
  });


  var ReplyBox = component.ReplyBox = React.createClass({
    getInitialState: function() {
      return {
        visible: false
      };
    },
    toggleVisiblity: function(e) {
      return this.setState({
        visible: !this.state.visible
      });
    },
    handler: function(e) {
      e.preventDefault();
      var content = React.findDOMNode(this.refs.content).value.trim();
      if (!content) {
        return;
      }
      this.props.submitHandler({content: content});
    },
    render: function() {
      console.log(this.state);
      if (!this.state.visible) {
        return (
          <input type="button" onClick={this.toggleVisibility} value="Reply" />
        );
      }
      return (
        <form className="ReplyBox" onSubmit={this.handler}>
          <textarea rows="4" cols="50" ref="content" />
          <input type="submit" value="Post" />
        </form> 
      )
    }
  });


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
