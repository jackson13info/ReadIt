var React = require("react"),
	Router = require("react-router"),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute;

var Home = require("./home.js"),
	Feed = require("./feed.js"),
	Comment = require("./comments.js");
	
var routes = (
	<Route handler={Home} name="home" path="/">
		<DefaultRoute handler={Feed} name="feed" />
		<Route handler={Comment} path="comments/:postURL" name="comments" />
	</Route>
);

module.exports = routes;