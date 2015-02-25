var RoomsActions = require('../actions/rooms-actions');
var React = require('react');
var Router = require('react-router');

var RoomsForm = React.createClass({

	mixins: [ Router.Navigation ],

	getInitialState: function(){
		return {
			name: null,
			values: null,
			requiredError: false,
			participants: {}
		}
	},

	handleSubmit: function( evt ){
		evt.preventDefault();

		if ( !this.state.name || !this.state.values ){
			return false;
		}

		RoomsActions.createRoom( this.state );  

		this.setState({ name: '', values: '' });
	},

	handleChangeName: function( evt ){
		this.setState({ name: evt.currentTarget.value });
	},

	handleChangeValues: function( evt ){
		this.setState({ values: evt.currentTarget.value });
	},

	render: function(){

		return (
			<div className="col-sm-12">
				<form onSubmit={this.handleSubmit} className="form-inline">
					<div className="form-group">
						<label>Room Name</label><input className="form-control" type="text" value={this.state.name} placeholder="Room Name" name="room-name" onChange={this.handleChangeName} />
					</div>
					<div className="form-group">
						<label>Values</label><input className="form-control" type="text" value={this.state.values} placeholder="ex: 1,2,3,5,8,13" name="room-name" onChange={this.handleChangeValues} />
					</div>
					<button className="btn btn-primary" type="submit" >Create</button>
				</form>
			</div>
		)
	}

});

module.exports = RoomsForm;