var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var RoomsService = require('../services/rooms-service');

var PlanningPoker = React.createClass({

	getInitialState: function(){
		return {
			stateName: 'home'
		}
	},

	componentDidMount: function(){
		RoomsService();
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

