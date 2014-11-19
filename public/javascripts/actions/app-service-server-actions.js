var AppService = require('../services/app-service');

var AppActions = {

	getAppInfo: function(){
		return AppService.getAppInfo()
	}

};

module.exports = AppActions;