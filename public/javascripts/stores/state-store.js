var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatcher/app-dispatcher');

var _stateInfo = {};

function setStateInfo( stateInfo ){
	_stateInfo = stateInfo;
}

var StateStore = merge( EventEmitter.prototype, {

	getStateInfo: function(){
		return _stateInfo;
	},

	dispatcherIndex: AppDispatcher.register(function( payload ){
		var action = payload.actionType;

		switch( action ){
			case 'navigate':
				setStateInfo( payload.stateInfo );
				StateStore.emit( 'state-changed' );
				break;
		}

		return true;
	})
});

module.exports = StateStore;