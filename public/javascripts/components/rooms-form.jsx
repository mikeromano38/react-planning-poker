var RoomsActions = require('../actions/rooms-actions');
var ParticipantUtils = require('../utils/participant-utils');
var AppInfoStore = require('../stores/app-info-store');
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

	componentDidMount: function(){
		//add our unique id once the app info api has loaded
		AppInfoStore.on('app-info-loaded', this.onAppInfoLoad );
	},

	componentWillUnmount: function(){
		AppInfoStore.removeListener('app-info-loaded', this.onAppInfoLoad );
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

	onAppInfoLoad: function(){
		this.state.owner = ParticipantUtils.generateParticipantId();
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