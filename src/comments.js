var React = require('react');

var CommentsView = React.createClass({
	render: function() {
		return (
			<div className="commentsView">
				<CommentBox pollInterval={this.props.pollInterval} postURL={this.props.params.postURL} />
			</div>
		)
	}
});

//Stuff Dealing with Comments will be down here
var CommentBox = React.createClass({
	loadCommentsFromServer: function() {
		var request = new XMLHttpRequest();
		request.open('GET', 'http://www.reddit.com' + decodeURIComponent(this.props.postURL) + ".json", true);
		request.onload = function() {
			var data = JSON.parse(request.responseText);
			this.setState({comments: data[1].data.children});
		}.bind(this);
		request.onerror = function() {
			//IDk what happened here
		};
		request.send();
	},	
	getInitialState: function() {
		return {comments: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		//setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			<div className="commentBox">
				<CommentList comments={this.state.comments} indentLevel="0" />
			</div>
		);
	}
});

/*
 * Just gets the imgur url from the specified
 * old URL. If the url is already perfect, nothing
 * is done.
 */
function getImgurURL(oldURL) {
	if (!oldURL) {
		return ("");
	}
	else if (oldURL.indexOf("imgur") == -1) {
		return ("");
	}
	else if (oldURL.replace(".com").indexOf(".") > -1) {
		return (oldURL.replace("gallery/",""));
	}
	
	var index = oldURL.lastIndexOf("/");
    var tempID = oldURL.substring(index + 1);
	var url = "http://i.imgur.com/" + tempID + ".jpg";
	return (url);
}

/*
 * Simply gets a nicely formatted time string from the specified
 * integer representing the Unix timestamp.
 */
function getTimeSinceNow(time) {
	var now = (new Date().getTime() / 1000.0);
	var seconds = Math.floor(Math.abs(time - now));
	var minutes = Math.floor(seconds / 60.0);
	var hours = Math.floor(minutes / 60.0);
	var days = Math.floor(hours / 24.0);
	var weeks = Math.floor(days / 7.0);
	var months = Math.floor(weeks / 4.0);
	var years = Math.floor(months / 12.0);
	var timeString = "";
	if (years > 0) {
		timeString = years + " year" + (years == 1 ? "" : "s");
	}
	else if (months > 0) {
		timeString = months + " month" + (months == 1 ? "" : "s");
	}
	else if (weeks > 0) {
		timeString = weeks + " week" + (weeks == 1 ? "" : "s");
	}
	else if (days > 0) {
		timeString = days + " day" + (days == 1 ? "" : "s");
	}
	else if (hours > 0) {
		timeString = hours + " hour" + (hours == 1 ? "" : "s");
	}
	else if (minutes > 0) {
		timeString = minutes + " minute" + (minutes == 1 ? "" : "s");
	}
	else if (seconds > 0) {
		timeString = seconds + " second" + (seconds == 1 ? "" : "s");
	}
	else {
		timeString = "now";
	}
	return (timeString);
}

var CommentList = React.createClass({
	render: function() {
		if (this.props.comments.count == 0) {
			return (
				<div></div>
			);
		}
		var comments = this.props.comments.map(function (comment) {
			var indent = parseInt(this.props.indentLevel);
			var replies;
			if (comment.data.replies) {
				replies = <CommentList comments={comment.data.replies.data.children} indentLevel={(indent + 1)} />;
			}
			return (
				<div>
					<Comment author={comment.data.author} title={comment.data.body} time={comment.data.created_utc} url={comment.data.url} indentLevel={indent} />
					{replies}
				</div>
			);
		}.bind(this));
		return (
			<div className="commentList">
				{comments}
			</div>
		);
	}
});
var Comment = React.createClass({
	render: function() {
		if (!this.props.title) {
			return (
				<div></div>
			);
		}
		var indent = parseInt(this.props.indentLevel);
		var commentStyle = {
				paddingLeft: ((indent + 1) * 10) + 'px'
		};
		var borders = [];
		for (var i = 1; i <= indent; i++) {
			var borderStyle = {
				left: ((i * 10) - 3) + 'px'
			};
			borders.push(<div className="borders" style={borderStyle}></div>);
		}
		return (
			<div className="comment" style={commentStyle}>
				{borders}
				<CommentTitle author={this.props.author} time={this.props.time} />
				<br/>{this.props.title}
			</div>
		);
	}
});
var CommentTitle = React.createClass({
	reloadTimeState: function() {
		var timeString = getTimeSinceNow(parseInt(this.props.time));
		this.setState({timeString: timeString});
	},
	getInitialState: function() {
		return {timeString: this.props.time};
	},
	componentDidMount: function() {
		this.reloadTimeState();
		//setInterval(this.reloadTimeState, 10000);
	},
	render: function() {
		return (
			<div className="commentTitle">
				<div className="author">{this.props.author} </div> 
				<div className="time">{this.state.timeString}</div>
			</div>
		)
	}
});
var CommentContent = React.createClass({
	render: function() {
		var content;
		if (this.props.type == "image") {
			var divStyle = {
				width: (window.innerWidth - 20),
				height: (window.innerWidth - 20),
				background: 'url('+this.props.url+') no-repeat center center',
				'background-size': 'cover',
				'margin-top':'10px'
			};
			content = <div style={divStyle}></div>;
		}
		else {
			var textStyle = {
				width: (window.innerWidth - 20)
			}
			var text = this.props.content;
			if (text == 0) {
				text = "That stinks. I got nothin..."
			}
			content = <div className="textContent" style={textStyle}>{text}</div>;
		}
		return (
			<div className="commentContent">
				{content}
			</div>
		);
	}
});

module.exports = CommentsView