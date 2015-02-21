var RoomsActions = require('../actions/rooms-actions');
var React = require('react');
var Router = require('react-router');

var RoomsForm = React.createClass({

	mixins: [ Router.Navigation ],

	getInitialState: function(){
		return {
			name: null,
			participants: {}
		}
	},

	handleSubmit: function( evt ){
		evt.preventDefault();

		if ( !this.state.name ){
			return false;
		}

		RoomsActions.createRoom( this.state );  

		this.setState({ name: '' });
	},

	handleChangeName: function( evt ){
		this.setState({ name: evt.currentTarget.value });
	},

	render: function(){
		return (
			<div className="col-sm-6">
				<form onSubmit={this.handleSubmit} className="form-inline">
					<label for="room-name">Room Name</label>
					<div className="form-group">
						<input className="form-control" type="text" value={this.state.name} placeholder="Enter New Room Name" name="room-name" onChange={this.handleChangeName} />
					</div>
					<button className="btn btn-primary" type="submit" >Create</button>
				</form>
			</div>
		)
	}

});

module.exports = RoomsForm;