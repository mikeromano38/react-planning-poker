var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatcher/app-dispatcher');

var _rooms = [];

var addRoom = function( room ){
	_rooms.push( room );
};

var removeRoom = function( roomKey ){
	for( var i = 0, l = _rooms.length; i < l; i++ ){
		if ( _rooms[ i ].key === roomKey ){
			_rooms.splice( i, 1 );
			break;
		}
	}
};

var RoomsStore = merge( EventEmitter.prototype, {

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

	dispatcherIndex: AppDispatcher.register(function( payload ){
		var action = payload.actionType;

		switch( action ){
			case 'create-room':
				addRoom( payload.room );
				RoomsStore.emit( 'change' );
				break;
			case 'remove-room':
				removeRoom( payload.roomKey );
				RoomsStore.emit( 'change' );
				break;
			case 'navigate':
				RoomsStore.emit( 'change' );
				break;
		}

		return true;
	})
});

module.exports = RoomsStore;