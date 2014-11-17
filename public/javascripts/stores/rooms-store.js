var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatcher/app-dispatcher');

var _rooms = [];

var addRoom = function( room ){
	_rooms.push( room );
};

var removeRoom = function( room ){
	_rooms.splice( _rooms.indexOf( room ), 1 );
};

var RoomsStore = merge( EventEmitter.prototype, {

	getAllRooms: function(){
		return _rooms;
	},

	dispatcherIndex: AppDispatcher.register(function( payload ){
		var action = payload.actionType;

		switch( action ){
			case 'create-room':
				addRoom( payload.room );
				RoomsStore.emit( 'change' );
				break;
			case 'remove-room':
				removeRoom( payload.room );
				RoomsStore.emit( 'change' );
				break;
		}

		return true;
	})
});

module.exports = RoomsStore;