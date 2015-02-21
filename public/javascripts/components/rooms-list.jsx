var React = require('react');
var spinner = require('./spinner');
var RoomsStore = require('../stores/rooms-store');
var RoomsActions = require('../actions/rooms-actions');
var Router = require('react-router');

var RoomsList = React.createClass({

	mixins: [ Router.Navigation ],

	getInitialState: function(){
		return {
			rooms: [],
			updated: false
		}
	},

	componentDidMount: function(){
		this.onStoreChange();
		RoomsStore.on('change', this.onStoreChange );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener('change', this.onStoreChange );
	},

	onStoreChange: function(){
		var rooms = RoomsStore.getAllRooms();
		var updated = RoomsStore.isLoaded();
		this.setState({
			rooms: rooms,
			updated: updated
		});
	},

	render: function(){
		var loading = null;
		var contents = null;

		if ( this.state.rooms.length === 0 && !this.state.updated ){
			loading = <li><Spinner /></li>;
		}

		if ( this.state.rooms.length ){
			contents = this.state.rooms.map(function(room) {
				return <RoomListItem room={room} key={room.key} />;
			});
		} else if ( !this.state.rooms.length && this.state.updated ){
			contents = <li>There are no active rooms.</li>
		}

		return (
			<div className="col-sm-6">
				<h4>Active Rooms</h4>
				{loading}

				<ul className="rooms-list">
					{contents}
				</ul>
			</div>
			)
	}

});

var RoomListItem = React.createClass({

	mixins: [ Router.Navigation ],

	componentDidMount: function(){

	},

	goToRoom: function(){
		this.transitionTo( 'room', { id: this.props.room.key } );
	},

	handleDelete: function(){
		//TODO: validate by not letting user delete room with participants inside
		RoomsActions.removeRoom( this.props.room.key );
	},

	render: function(){

		//TODO: implement this correctly by tracking user/owned rooms on the server
		//var deleteBtn = null;
		//
		//var ownedRooms = JSON.parse( localStorage.getItem( 'ownedRooms' ) ) || [];
		//var idx = ownedRooms.indexOf( this.props.room.key );

		//if ( idx > -1 ){
		//	deleteBtn = <button className="btn btn-danger btn-xs" onClick={this.handleDelete}>Delete</button>;
		//}

		return (
			<li>
				<a onClick={this.goToRoom}><span>{this.props.room.name}</span></a>
				<button className="btn btn-danger btn-xs" onClick={this.handleDelete}>Delete</button>
			</li>
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
