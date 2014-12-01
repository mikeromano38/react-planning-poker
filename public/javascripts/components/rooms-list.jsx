var React = require('react');
var spinner = require('./spinner');
var RoomsStore = require('../stores/rooms-store');
var StateActions = require('../actions/state-actions');
var RoomsServerActions = require('../actions/rooms-server-actions');
var Router = require('react-router');

var RoomsList = React.createClass({

	mixins: [ Router.Navigation ],

	getInitialState: function(){
		return {
			rooms: []
		}
	},

	componentDidMount: function(){
		this.onStoreChange();
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

	mixins: [ Router.Navigation ],

	render: function(){
		var deleteBtn = null;

		var ownedRooms = JSON.parse( localStorage.getItem('ownedRooms') ) || [];
		var idx = ownedRooms.indexOf( this.props.room.key );

		if ( idx > -1 ){
			deleteBtn = <button onClick={this.handleDelete}>Delete</button>;
		}

		return (
			<li>
				<a onClick={this.goToRoom}><span>{this.props.room.name}</span></a>
				{deleteBtn}
			</li>
		)
	},

	goToRoom: function(){
		this.transitionTo( 'room', { id: this.props.room.key } );
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
