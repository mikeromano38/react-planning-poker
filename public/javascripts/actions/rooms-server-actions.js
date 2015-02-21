var roomsService = require('../services/rooms-service');
var AppDispatcher = require('../dispatcher/app-dispatcher');

var RoomsActions = {

	roomsLoaded: function( newRooms ){
		AppDispatcher.dispatch({
			actionType: 'rooms-loaded',
			newRooms: newRooms
		});
	},

	roomLoadedFailure: function( room ){
		AppDispatcher.dispatch({
			actionType: 'rooms-loaded-failure',
			room: room
		});
	},
	//
	//createRoom: function( room ){
	//	var newRoom = roomsService.create( room );
	//
	//	var ownedRooms = JSON.parse( localStorage.getItem( 'ownedRooms' ) ) || [];
	//	ownedRooms.push( newRoom.name() );
	//	localStorage.setItem( 'ownedRooms', JSON.stringify( ownedRooms ) );
	//
	//	return newRoom;
	//},

	//addParticipant: function( key, userId ){
	//	return roomsService.addParticipant( key, userId );
	//},

	setSelectedCard: function( key, userId, cardVal ){
		return roomsService.setSelectedCard( key, userId, cardVal );
	}

	//removeRoom: function( roomKey ){
	//	roomsService.remove( roomKey );
	//
	//	var ownedRooms = JSON.parse( localStorage.getItem( 'ownedRooms' ) ) || [];
	//	var idx = ownedRooms.indexOf( roomKey );
	//	if ( idx > -1 ){
	//		ownedRooms.splice( idx, 1 );
	//	}
	//	localStorage.setItem( 'ownedRooms', JSON.stringify( ownedRooms ) );
	//}

};

module.exports = RoomsActions;