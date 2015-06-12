var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var MainView = React.createClass({
	render: function() {
		return (
			<div className="mainView">
				<PostBox pollInterval={this.props.pollInterval} />
			</div>
		)
	}
});

//Stuff Dealing with Posts will be down here
var PostBox = React.createClass({
	loadPostsFromServer: function() {
		var request = new XMLHttpRequest();
		request.open('GET', 'http://www.reddit.com/.json', true);
		request.onload = function() {
			var data = JSON.parse(request.responseText);
			this.setState({posts: data.data.children});
		}.bind(this);
		request.onerror = function() {
			//IDk what happened here
		};
		request.send();
	},	
	getInitialState: function() {
		return {posts: []};
	},
	componentDidMount: function() {
		this.loadPostsFromServer();
		setInterval(this.loadPostsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			<div className="postBox">
				<PostList posts={this.state.posts}/>
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

var PostList = React.createClass({
	render: function() {
		var posts = this.props.posts.map(function (post) {
			return (
				<div>
					<Link to="comments" params={{postURL: encodeURIComponent(post.data.permalink)}}>
						<Post author={post.data.author} title={post.data.title} time={post.data.created_utc} url={post.data.url} content={post.data.selftext} />
					</Link>
				</div>
			);
		});
		return (
			<div className="postList">
				{posts}
			</div>
		);
	}
});
var Post = React.createClass({
	render: function() {
		var content;
		var imgURL = getImgurURL(this.props.url);
		if (imgURL.length == 0) {
			content = <PostContent type="text" content={this.props.content} />
		}
		else {
			content = <PostContent type="image" url={imgURL} />
		}
		return (
			<div className="post">
				<PostTitle author={this.props.author} time={this.props.time} />
				<br/>{this.props.title}
				{content}
			</div>
		);
	}
});
var PostTitle = React.createClass({
	reloadTimeState: function() {
		var timeString = getTimeSinceNow(parseInt(this.props.time));
		this.setState({timeString: timeString});
	},
	getInitialState: function() {
		return {timeString: this.props.time};
	},
	componentDidMount: function() {
		this.reloadTimeState();
		setInterval(this.reloadTimeState, 10000);
	},
	render: function() {
		return (
			<div className="postTitle">
				<div className="author">{this.props.author} </div> 
				<div className="time">{this.state.timeString}</div>
			</div>
		)
	}
});
var PostContent = React.createClass({
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
				text = "No Content..."
			}
			content = <div className="textContent" style={textStyle}>{text}</div>;
		}
		return (
			<div className="postContent">
				{content}
			</div>
		);
	}
});

module.exports = MainView