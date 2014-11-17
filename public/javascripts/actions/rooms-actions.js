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

	removeRoom: function( room ){
		AppDispatcher.dispatch({
			actionType: 'remove-room',
			room: room
		});
	}

};

module.exports = RoomsActions;