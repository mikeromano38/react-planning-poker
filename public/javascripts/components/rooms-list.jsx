var React = require('react');
var spinner = require('./spinner');
var RoomsStore = require('../stores/rooms-store');

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
						return <RoomListItem roomName={room} />;
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
		return (
			<li>{this.props.roomName}</li>
		)
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
