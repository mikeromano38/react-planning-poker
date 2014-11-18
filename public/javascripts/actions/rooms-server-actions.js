var RoomsService = require('../services/rooms-service');

var RoomsActions = {

	createRoom: function( room ){
		var roomsService = RoomsService();
		roomsService.create( room );
	},

	removeRoom: function( roomKey ){
		debugger
		var roomsService = RoomsService();
		roomsService.remove( roomKey );
	}

};

module.exports = RoomsActions;