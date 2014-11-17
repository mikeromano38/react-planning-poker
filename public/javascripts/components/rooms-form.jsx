//var RoomsActions = require('../actions/rooms-actions');
var RoomsService = require('../services/rooms-service');
var React = require('react');

var roomsService = null;

var RoomsForm = React.createClass({

	getInitialState: function(){
		return { name: null }
	},

	componentDidMount: function(){
		roomsService = RoomsService.connect();
	},

	handleSubmit: function( evt ){
		evt.preventDefault();

		if ( !this.state.name ){
			return false;
		}

		roomsService.push( this.state );
		this.setState({ name: '' });
	},

	handleChangeName: function( evt ){
		this.setState({ name: evt.currentTarget.value });
	},

	render: function(){
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text" value={this.state.name} placeholder="Enter New Room Name" onChange={this.handleChangeName} />
				<button type="submit" >Create</button>
			</form>
		)
	}

});

module.exports = RoomsForm;