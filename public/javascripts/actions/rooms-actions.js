var AppDispatcher = require('../dispatcher/app-dispatcher');

var RoomsActions = {

	roomLoaded: function( room ){
		AppDispatcher.dispatch({
			actionType: 'create-room',
			room: room
		});
	},

	roomLoadedFailure: function( room ){
		AppDispatcher.dispatch({
			actionType: 'create-room',
			room: room
		});
	},

	removeRoom: function( roomKey ){
		AppDispatcher.dispatch({
			actionType: 'remove-room',
			roomKey: roomKey
		});
	}

};

module.exports = RoomsActions;