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

		var contents = null;

		if ( this.state.rooms.length === 0 && !this.state.updated ){
			contents = <tr><td><Spinner /></td></tr>;
		}

		if ( this.state.rooms.length ){
			contents = this.state.rooms.map(function(room) {
				return <RoomListItem room={room} key={room.key} />;
			});
		} else if ( !this.state.rooms.length && this.state.updated ){
			contents = <tr><td>There are no active rooms.</td></tr>
		}

		return (
			<div className="col-sm-12">
				<h4>&nbsp;</h4>
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Values</th>
							<th>Participants</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{contents}
					</tbody>
				</table>
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
		var numParticipants = ( this.props.room.participants ) ? Object.keys( this.props.room.participants ).length : 0;
		var deleteButton = ( !numParticipants ) ? <button className="btn btn-danger btn-xs" onClick={this.handleDelete}>Delete</button> : '';
		return (
			<tr>
				<td>
					<a onClick={this.goToRoom} onTouchStart={this.goToRoom}>{this.props.room.name}</a>
				</td>
				<td>
					<span>{this.props.room.values}</span>
				</td>
				<td>
					<span>{numParticipants}</span>
				</td>
				<td>
					{deleteButton}
				</td>
			</tr>
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
