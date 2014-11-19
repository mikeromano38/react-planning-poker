var RoomsService = require('../services/rooms-service');

var RoomsActions = {

	createRoom: function( room ){
		var roomsService = RoomsService();
		var newRoom = roomsService.create( room );

		var ownedRooms = JSON.parse( localStorage.getItem( 'ownedRooms' ) ) || [];
		ownedRooms.push( newRoom.name() );
		localStorage.setItem( 'ownedRooms', JSON.stringify( ownedRooms ) );
	},

	removeRoom: function( roomKey ){
		var roomsService = RoomsService();
		roomsService.remove( roomKey );

		var ownedRooms = JSON.parse( localStorage.getItem( 'ownedRooms' ) ) || [];
		var idx = ownedRooms.indexOf( roomKey );
		if ( idx > -1 ){
			ownedRooms.splice( idx, 1 );
		}
		localStorage.setItem( 'ownedRooms', JSON.stringify( ownedRooms ) );
	}

};

module.exports = RoomsActions;