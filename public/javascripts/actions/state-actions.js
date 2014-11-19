var AppDispatcher = require('../dispatcher/app-dispatcher');

module.exports = {
	navigateToState: function( state ){
		AppDispatcher.dispatch({
			actionType: 'navigate',
			stateInfo: state
		});
	}
}