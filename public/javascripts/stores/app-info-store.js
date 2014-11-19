var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppServiceServerActions = require('../actions/app-service-server-actions');
var AppDispatcher = require('../dispatcher/app-dispatcher');

var _appInfo = {};

var AppInfoStore = merge( EventEmitter.prototype, {

	getAppInfo: function(){
		return _appInfo;
	},

	initialize: function(){
		AppServiceServerActions.getAppInfo();
	},

	dispatcherIndex: AppDispatcher.register(function( payload ){
		var action = payload.actionType;

		switch( action ){
			case 'app-info-loaded':
				_appInfo = payload.info;
				AppInfoStore.emit( 'app-info-loaded' );
				break;
		}

		return true;
	})
});

AppInfoStore.initialize();

module.exports = AppInfoStore;