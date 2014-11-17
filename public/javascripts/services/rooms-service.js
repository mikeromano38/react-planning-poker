var RoomsActions = require('../actions/rooms-actions');

var RoomsService = (function(){

	var connection = null;

	function connect(){
		if (!connection){
			connection = new Firebase('https://romanocreative.firebaseio.com/rooms');

			connection.on('child_added', function( snapshot ){
				RoomsActions.createRoomSuccess( snapshot.val() );
			}, function( err ){
				RoomsActions.createRoomFailure( err );
			});
		}

		return connection;
	}

	return {
		connect: connect
	}

})();

module.exports = RoomsService;