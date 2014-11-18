var RoomsActions = require('../actions/rooms-actions');
var connection = null;

var RoomsService = function(){

	if (!connection){
		connection = new Firebase('https://romanocreative.firebaseio.com/rooms');

		connection.on('child_added', function( snapshot ){
			debugger
			var room =  snapshot.val();
			room.key = snapshot.name();

			RoomsActions.roomLoaded( room );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});

		connection.on('child_removed', function( snapshot ){
			console.log('child_removed triggered')
			var key = snapshot.name();
			RoomsActions.removeRoom( key );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});
	}

	function create( room ){
		connection.push( room );
	}

	function remove( key ){
		debugger
		var removeRef = new Firebase('https://romanocreative.firebaseio.com/rooms/' + key );
		removeRef.remove();
	}

	return {
		create: create,
		remove: remove
	}

};

module.exports = RoomsService;