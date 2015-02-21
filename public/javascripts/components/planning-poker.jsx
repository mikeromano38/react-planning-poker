var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var PlanningPoker = React.createClass({

	getInitialState: function(){
		return {
			stateName: 'home'
		}
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

