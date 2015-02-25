var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatcher/app-dispatcher');
var firebaseConnection  = require('../firebaseConnection');
var NameGenerator = require('../utils/name-generator');

var _rooms = [];
var _loaded = false;
var _currentUser = null;
var _currentRoomKey = null;
var _currentUserRef = null;

var roomsRef = firebaseConnection.child('/rooms');

roomsRef.on('value', function( snapshot ){
	_rooms.length = 0;

	_loaded = true;
	var roomList = snapshot.val();
	updateRooms( roomList );
	RoomsStore.emit('change');

});

var updateRooms = function( newRooms ){
	for ( var roomKey in newRooms ){
		var room = newRooms[ roomKey ];
		room.key = roomKey;
		_rooms.push( room );
	}
};

var createRoom = function( room ){
	var roomsRef = firebaseConnection.child('/rooms');
	roomsRef.push( room );
};

var removeRoom = function( roomKey ){
	var roomRef = firebaseConnection.child('/rooms/' + roomKey );
	roomRef.remove();
};

var revealCardsForRoom = function( bool, roomKey ){
	var roomRef = firebaseConnection.child('/rooms/' + roomKey );
	roomRef.update({ revealCards: bool });
};

var resetCardsForRoom = function( roomKey ){
	var roomRef = firebaseConnection.child('/rooms/' + roomKey );
	var participantsRef = firebaseConnection.child('/rooms/' + roomKey + '/participants' );

	roomRef.update({ revealCards: false });

	participantsRef.once( 'value', function( snapshot ){
		for ( var participant in snapshot.val() ){
			participantsRef.child( participant ).update({ selected: null });
		}
	});
};

var getValuesFromString = function( str ){
	return str.trim().split(',').map(function( val ){
		return val.trim();
	});
};

var getEstimationResultsForRoom = function( roomKey ){
	var participants;
	var participant;
	var results = [];

	var room = _rooms.filter(function( room ){
		return room.key === roomKey;
	})[ 0 ];

	if ( room ){
		participants = room.participants;

		results = getValuesFromString( room.values ).map(function( opt ){
			return { val: opt, numVotes: 0 };
		});

		if ( participants ){
			for ( var partKey in participants ){
				participant = participants[ partKey ];
				if ( participant && participant.selected ){
					results.filter(function( opt ){
						return opt.val === participant.selected;
					})[ 0 ].numVotes++;
				}
			}
		}
	}

	return results;
};

var addUserToRoom = function( user, roomKey ){
	if ( _currentUserRef ){
		_currentUserRef.off();
	}

	var participantsRef = firebaseConnection.child('/rooms/' + roomKey + '/participants' );
	var roomRef = firebaseConnection.child('/rooms/' + roomKey );

	/**
	 * HACK: If this room was abandoned with the cards revealed
	 * we must hide them
	 */
	roomRef.once('value', function( snapshot ){
		var val = snapshot.val();

		if ( val && ( !val.participants || !Object.keys( val.participants ).length ) && val.revealCards ){
			roomRef.update({ revealCards: false });
		}
	});

	_currentUserRef = participantsRef.push( user );
	_currentUserRef.onDisconnect().remove();

	_currentUserRef.on('value', function( snapshot ){
		_currentUser = snapshot.val();

		if ( _currentUser ){
			_currentUser.key = snapshot.name();
		}

		RoomsStore.emit('change');
	});
};

var setSelectedForCurrentUser = function( val ){
	_currentUserRef.update({ selected: val });
};

var removeCurrentUser = function(){
	_currentUserRef.off();
	_currentUserRef.remove();
	_currentUser = null;
};

var generateRandomNameForRoom = function( roomKey ) {
	_currentRoomKey = roomKey;
	NameGenerator.generate();
};

var setNameAndEnterRoom = function( name ){
	if ( _currentRoomKey ){
		addUserToRoom({ name: name }, _currentRoomKey );
		_currentRoomKey = null;
	}
};

var displayError = function( err ){
	alert( err.body.message || 'There was an error.' );
};

var RoomsStore = merge( EventEmitter.prototype, {

	isLoaded: function(){
		return _loaded;
	},

	getAllRooms: function(){
		return _rooms;
	},

	getRoom: function( roomKey ){
		for( var i = 0, l = _rooms.length; i < l; i++ ){
			if ( _rooms[ i ].key === roomKey ){
				return _rooms[ i ];
				break;
			}
		}
	},

	getValues: function( roomKey ){
		var room = _rooms.filter(function( room ){
			return room.key === roomKey;
		})[ 0 ];

		return getValuesFromString( room.values );
	},

	getEstimationResultsForRoom: getEstimationResultsForRoom,

	getCurrentUser: function(){
		return _currentUser;
	},

	dispatcherIndex: AppDispatcher.register(function( payload ){
		var action = payload.actionType;

		switch( action ){
			case 'create-room':
				createRoom( payload.room );
				break;
			case 'remove-room':
				removeRoom( payload.roomKey );
				break;
			case 'remove-current-user':
				removeCurrentUser();
				break;
			case 'add-user-to-room':
				addUserToRoom( payload.user, payload.roomKey );
				break;
			case 'set-selected-for-current-user':
				setSelectedForCurrentUser( payload.selectedVal );
				break;
			case 'reveal-cards-for-room':
				revealCardsForRoom( payload.bool, payload.roomKey );
				break;
			case 'reset-cards-for-room':
				resetCardsForRoom( payload.roomKey );
				break;
			case 'create-anonymous-name':
				generateRandomNameForRoom( payload.roomKey );
				break;
			case 'name-generated-successfully':
				setNameAndEnterRoom( payload.name );
				break;
			case 'name-generation-failure':
				displayError( payload.err );
				break;

		}

		return true;
	})
});

module.exports = RoomsStore;