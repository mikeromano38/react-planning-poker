var React = require('react');
var spinner = require('./spinner');
var RoomsStore = require('../stores/rooms-store');
var ParticipantUtils = require('../utils/participant-utils');
var RoomsServerActions = require('../actions/rooms-server-actions');

var RoomsList = React.createClass({

	getInitialState: function(){
		return {
			rooms: []
		}
	},

	componentDidMount: function(){
		RoomsStore.on('change', this.onStoreChange );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener('change', this.onStoreChange );
	},

	render: function(){
		var loading = null;
		if ( this.state.rooms.length === 0 ){
			loading = <Spinner />;
		}
		return (
			<div>
				{loading}
				<ul>
					{this.state.rooms.map(function(room) {
						return <RoomListItem room={room} key={room.key} />;
					})}
				</ul>
			</div>
			)
	},

	onStoreChange: function(){
		var rooms = RoomsStore.getAllRooms();
		this.setState({ rooms: rooms });
	}

});

var RoomListItem = React.createClass({
	render: function(){
		var deleteBtn = null;

		if ( this.props.room.owner === ParticipantUtils.generateParticipantId() ){
			deleteBtn = <button onClick={this.handleDelete}>Delete</button>;
		}

		return (
			<li>
				<span>{this.props.room.name}</span>
				{deleteBtn}
			</li>
		)
	},

	handleDelete: function(){
		RoomsServerActions.removeRoom( this.props.room.key );
	}
});

var Spinner = React.createClass({
	componentDidMount: function(){
		spinner( 'spinner' );
	},
	render: function(){
		return (
			<div id="spinner" />
		)
	}
});

module.exports = RoomsList;
