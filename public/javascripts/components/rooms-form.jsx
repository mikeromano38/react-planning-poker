var RoomsServerActions = require('../actions/rooms-server-actions');
var React = require('react');

var RoomsForm = React.createClass({

	getInitialState: function(){
		return { name: null }
	},

	handleSubmit: function( evt ){
		evt.preventDefault();

		if ( !this.state.name ){
			return false;
		}

		RoomsServerActions.createRoom( this.state );
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