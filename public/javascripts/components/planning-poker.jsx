var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var RoomsService = require('../services/rooms-service');
var UsersService = require('../services/users-service');

var PlanningPoker = React.createClass({

	getInitialState: function(){
		return {
			stateName: 'home'
		}
	},

	componentDidMount: function(){
		RoomsService();
		UsersService();
	},

	render: function(){
		return(
			<div>
				<RouteHandler />
			</div>
		)
	}
});

module.exports = PlanningPoker;

