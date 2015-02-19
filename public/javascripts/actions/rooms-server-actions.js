var RoomsService = require('../services/rooms-service');

var RoomsActions = {

	createRoom: function( room ){
		var roomsService = RoomsService();
		var newRoom = roomsService.create( room );

		var ownedRooms = JSON.parse( localStorage.getItem( 'ownedRooms' ) ) || [];
		ownedRooms.push( newRoom.name() );
		localStorage.setItem( 'ownedRooms', JSON.stringify( ownedRooms ) );

		return newRoom;
	},

	addParticipant: function( key, userId ){
		var roomsService = RoomsService();
		return roomsService.addParticipant( key, userId );
	},

	setSelectedCard: function( key, userId, cardVal ){
		var roomsService = RoomsService();
		return roomsService.setSelectedCard( key, userId, cardVal );
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