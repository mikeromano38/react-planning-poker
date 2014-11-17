var RoomsActions = require('../actions/rooms-actions');
var connection = null;

var RoomsService = function(){

	if (!connection){
		connection = new Firebase('https://romanocreative.firebaseio.com/rooms');

		connection.on('child_added', function( snapshot ){
			RoomsActions.roomLoaded( snapshot.val() );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});
	}

	function create( room ){
		connection.push( room );
	}

	return {
		create: create
	}

};

module.exports = RoomsService;