var AppDispatcher = require('../dispatcher/app-dispatcher');

module.exports = {
	appInfoLoaded: function( info ){
		AppDispatcher.dispatch({
			actionType: 'app-info-loaded',
			info: info
		});
	}
};