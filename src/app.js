var React = require("react"),
	Router = require("react-router");

var routes = require("./routes.js");

var router = Router.create({routes: routes});

router.run(function(Handler) {
	React.render(
		<Handler />,
		document.body
	)
});