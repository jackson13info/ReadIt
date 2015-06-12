var React = require("react"),
	Router = require("react-router"),
	RouteHandler = Router.RouteHandler;
	
var NavigationBar = require('./navigationBar.js');

module.exports = React.createClass({
	render: function() {
		var elements = [{"title":"Home"}];
		return (
			<div>
				<NavigationBar elements={elements} />
				<RouteHandler {...this.props} />
			</div>
		);
	}
});