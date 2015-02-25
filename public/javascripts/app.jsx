var React = require('react');
var PlanningPoker = require('./components/planning-poker.jsx');
var Index = require('./components/index.jsx');
var Room = require('./components/room.jsx');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

//React.initializeTouchEvents(true);

var routes = (
	<Route handler={PlanningPoker}>
		<DefaultRoute handler={Index}/>
		<Route name="home" path="/" handler={Index}/>
		<Route name="room" path="room/:id" handler={Room}/>
		<NotFoundRoute handler={Index}/>
	</Route>
);

Router.run(routes, Router.HistoryLocation, function ( Handler ) {
	React.render(<Handler />, document.getElementById('planning-poker'));
});



