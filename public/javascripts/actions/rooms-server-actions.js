var RoomsService = require('../services/rooms-service');

var RoomsActions = {

	createRoom: function( room ){
		var roomsService = RoomsService( this );
		roomsService.create( room );
	}

};

module.exports = RoomsActions;