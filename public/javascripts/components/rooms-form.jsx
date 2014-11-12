var roomsService = require('../firebase');
var React = require('react');

var RoomsForm = React.createClass({
	getInitialState: function(){
		return { name: null }
	},
	handleSubmit: function( evt ){
		var connection = roomsService.connect();
		connection.push( this.state );
		this.state.name = null;
		evt.preventDefault();
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

module.exports = function( target ){
	return React.render( <RoomsForm />, target );
};