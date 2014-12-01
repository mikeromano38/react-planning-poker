var React = require('react');
var RoomsForm = require('../components/rooms-form.jsx');
var RoomsList = require('../components/rooms-list.jsx');

var Index = React.createClass({

	componentDidMount: function(){

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

module.exports = Index;

