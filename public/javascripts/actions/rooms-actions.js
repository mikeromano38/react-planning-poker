var AppDispatcher = require('../dispatcher/app-dispatcher');

var RoomsActions = {

	//createRoom: function( room ){
	//	var roomsService = RoomsService.connect();
	//	roomsService.push( room );
	//},

	createRoomSuccess: function( room ){
		AppDispatcher.dispatch({
			actionType: 'create-room',
			room: room
		});
	},

	createRoomFailure: function(){

	},

	removeRoom: function( room ){
		AppDispatcher.dispatch({
			actionType: 'remove-room',
			room: room
		});
	}

};

module.exports = RoomsActions;