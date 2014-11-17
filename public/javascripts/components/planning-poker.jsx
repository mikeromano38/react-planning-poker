var React = require('react');
var RoomsService = require('../services/rooms-service');
var RoomsForm = require('./rooms-form.jsx');
var RoomsList = require('./rooms-list.jsx');

var PlanningPoker = React.createClass({

	componentDidMount: function(){
		RoomsService.connect();
	},

	render: function(){
		return(
			<div>
				<RoomsForm />
				<RoomsList />
			</div>
		)
	}
});

module.exports = PlanningPoker;

