var RoomsServerActions = require('../actions/rooms-server-actions');
var ParticipantUtils = require('../utils/participant-utils');
var AppInfoStore = require('../stores/app-info-store');
var React = require('react');

var RoomsForm = React.createClass({

	getInitialState: function(){
		return {
			name: null,
			participants: []
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

		RoomsServerActions.createRoom( this.state );
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
			<form onSubmit={this.handleSubmit}>
				<input type="text" value={this.state.name} placeholder="Enter New Room Name" onChange={this.handleChangeName} />
				<button type="submit" >Create</button>
			</form>
		)
	}

});

module.exports = RoomsForm;