var React = require('react');
var RoomsStore = require('../stores/rooms-store');
var Router = require('react-router');
var RoomsServerActions = require('../actions/rooms-server-actions');

var participant = null;

var Room = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		var state = this.getRoomStateFromStore( this.getParams().id ) || {};
		state.participantName = null;
		return state;
	},

	componentDidMount: function(){
		RoomsStore.on('change', this.setStateFromStore );
	},

	componentWillUnmount: function(){
		if ( participant ){
			participant.remove();
		}

		RoomsStore.removeListener('change', this.setStateFromStore );
	},

	getRoomStateFromStore: function(){
		return RoomsStore.getRoom( this.getParams().id ) || {};
	},

	setStateFromStore: function(){
		var state = this.getRoomStateFromStore();
			state.participantName = this.state.participantName;

		this.setState( state );
	},

	enterRoom: function(){
		participant = RoomsServerActions.addParticipant( this.getParams().id, this.state.participantName );
		debugger
		this.forceUpdate();
	},

	handleUserNameKeyup: function( evt ){
		var state = this.state;
		this.state.participantName = evt.target.value;

		this.setState( state );
	},

	render: function(){
		var view;

		if ( participant ){
			view = (
				<div>
					<a onClick={this.navigateHome}>Back to home</a>
					<h1 title={ this.getParams().id }>Room { this.state.name } | user: {this.state.participantName}</h1>
				</div>
			);
		} else {
			view = (
				<div>
					<label>Enter a name to use in the planning room:</label>
					<input onChange={this.handleUserNameKeyup} value={this.state.participantName} placeholder="Enter Name"/>
					<button onClick={this.enterRoom}>Enter Room</button>
				</div>
			);
		}

		return view;
	},

	navigateHome: function(){
		this.transitionTo( 'home' );
	}
});

module.exports = Room;

