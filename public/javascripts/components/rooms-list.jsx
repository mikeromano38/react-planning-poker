var React = require('react');
var spinner = require('./spinner');
var RoomsStore = require('../stores/rooms-store');
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
						return <RoomListItem roomName={room.name} roomKey={room.key} key={room.key} />;
					})}
				</ul>
			</div>
			)
	},

	onStoreChange: function(){
		var rooms = RoomsStore.getAllRooms();
		debugger
		this.setState({ rooms: rooms });
	}

});

var RoomListItem = React.createClass({
	render: function(){
		return (
			<li>
				<span>{this.props.roomName}</span>
				<button onClick={this.handleDelete}>Delete</button>
			</li>
		)
	},

	handleDelete: function(){
		debugger
		RoomsServerActions.removeRoom( this.props.roomKey );
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
