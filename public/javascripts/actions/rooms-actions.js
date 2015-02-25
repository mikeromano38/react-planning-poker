var AppDispatcher = require('../dispatcher/app-dispatcher');

var RoomsActions = {

	removeRoom: function( roomKey ){
		AppDispatcher.dispatch({
			actionType: 'remove-room',
			roomKey: roomKey
		});
	},

	createRoom: function( room ){
		AppDispatcher.dispatch({
			actionType: 'create-room',
			room: room
		});
	},

	revealCardsForRoom: function( bool, roomKey ){
		AppDispatcher.dispatch({
			actionType: 'reveal-cards-for-room',
			bool: bool,
			roomKey: roomKey
		});
	},

	resetCardsForRoom: function( roomKey ){
		AppDispatcher.dispatch({
			actionType: 'reset-cards-for-room',
			roomKey: roomKey
		});
	},

	addUserToRoom: function( user, roomKey ){
		AppDispatcher.dispatch({
			actionType: 'add-user-to-room',
			roomKey: roomKey,
			user: user
		});
	},

	setSelectedForCurrentUser: function( selectedVal ){
		AppDispatcher.dispatch({
			actionType: 'set-selected-for-current-user',
			selectedVal: selectedVal
		});
	},

	removeCurrentUser: function(){
		AppDispatcher.dispatch({
			actionType: 'remove-current-user'
		});
	},

	createAnonymousNameForRoom: function( roomKey ){
		AppDispatcher.dispatch({
			actionType: 'create-anonymous-name',
			roomKey: roomKey
		});
	},

	nameGeneratedSuccessfully: function( name ){
		AppDispatcher.dispatch({
			actionType: 'name-generated-successfully',
			name: name
		});
	},

	nameGenerationFailure: function( err ){
		AppDispatcher.dispatch({
			actionType: 'name-generation-failure',
			err: err
		});
	}

};

module.exports = RoomsActions;