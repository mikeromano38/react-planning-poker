var RoomsActions = require('../actions/rooms-actions');
var connection = null;

var RoomsService = function(){
	if (!connection){
		connection = new Firebase('https://romanocreative.firebaseio.com/rooms');

		connection.on('child_added', function( snapshot ){
			var room =  snapshot.val();
			room.key = snapshot.name();

			RoomsActions.roomLoaded( room );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});

		connection.on('child_removed', function( snapshot ){
			var key = snapshot.name();
			RoomsActions.removeRoom( key );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});
	}

	function create( room ){
		return connection.push( room );
	}

	function remove( key ){
		var removeRef = new Firebase('https://romanocreative.firebaseio.com/rooms/' + key );
		removeRef.remove();
	}

	function addParticipant( key, name ){
		var participants = new Firebase( 'https://romanocreative.firebaseio.com/rooms/' + key + '/participants' );
		return participants.push({ name: name });
	}

	return {
		create: create,
		addParticipant: addParticipant,
		remove: remove
	}

};

module.exports = RoomsService;