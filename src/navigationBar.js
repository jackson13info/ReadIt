//Navigation Bar Module

var React = require('react');

var NavigationBar = React.createClass({
	render: function() {
		var elements = this.props.elements.map(function (element) {
			return (
				<NavigationElement title={element.title} />
			);
		});
		return (
			<div className="navigationBox">
				{elements}
			</div>
		);
	}
});
var NavigationElement = React.createClass({
	render: function() {
		return (
			<div className="navigationElement">
				{this.props.title}
			</div>
		);
	}
});

module.exports = NavigationBar