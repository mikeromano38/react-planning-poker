var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatcher/app-dispatcher');
var firebaseConnection  = require('../firebaseConnection');
var NameGenerator = require('../utils/name-generator');

var _rooms = [];
var _easterEggsEnabled = false;
var _loaded = false;
var _randomName = null;
var _currentUser = null;
var _currentUserRef = null;
var _nameIsGenerating = false;

var roomsRef = firebaseConnection.child('/rooms');

roomsRef.on('value', function( snapshot ){
	_rooms.length = 0;

	_loaded = true;
	var roomList = snapshot.val();
	updateRooms( roomList );
	RoomsStore.emit('change');

});

var easterEggConnection = firebaseConnection.child('/easter-eggs-enabled');

easterEggConnection.on('value', function( snapshot ){
	_easterEggsEnabled = snapshot.val();
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
	var modes = [];

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

	var votes = results.filter(function( result ){
		assignMode( result, modes );
		return result.numVotes > 0;
	});

	var numeric = true;

	results.forEach(function( result ){
		if ( isNaN( Number( result.val ) ) ){
			numeric = false;
		}
	});

	var mode = modes.reduce(function( last, current ){
		if ( Number( current.val ) > Number( last.val ) ){
			return current;
		} else {
			return last;
		}
	});

	function assignMode( result, modes ){
		if ( !modes.length ) {
			return modes.push( result );
		} else {
			modes.forEach(function( mode ){
				if ( result.numVotes > mode.numVotes ){
					modes.length = 0;
					modes.push( result );
				} else if ( result.numVotes === mode.numVotes ) {
					modes.push( result );
				}
			});
		}
	}

	results.mode = ( numeric ) ? mode : null;
	results.modes = modes;
	results.votes = votes;

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
		var oneSelected = false;

		if ( val.participants ){
			for ( var part in val.participants ){
				if ( val.participants[ part ].selected ){
					oneSelected = true;
				}
			}
		}

		if ( !oneSelected || ( val && ( !val.participants || !Object.keys( val.participants ).length ) && val.revealCards ) ){
			roomRef.update({ revealCards: false });
		}
	});


	setRandomName( null );
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

var generateRandomNameForRoom = function() {
	_nameIsGenerating = true;
	NameGenerator.generate();
};

var getRandomName = function(){
	return _randomName;
};

var setRandomName = function( name ){
	_randomName = name;
	_nameIsGenerating = false;
	RoomsStore.emit('change');
};

var displayError = function( err ){
	alert( err.body.message || 'There was an error.' );
};

var RoomsStore = merge( EventEmitter.prototype, {

	easterEggsEnabled: function(){
		return _easterEggsEnabled;
	},

	isLoaded: function(){
		return _loaded;
	},

	nameIsGenerating: function(){
		return _nameIsGenerating;
	},

	getAllRooms: function(){
		return _rooms;
	},

	getRandomName: getRandomName,

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
				setRandomName( payload.name );
				break;
			case 'name-generation-failure':
				displayError( payload.err );
				break;

		}

		return true;
	})
});

module.exports = RoomsStore;