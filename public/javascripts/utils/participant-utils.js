var AppInfoStore = require('../stores/app-info-store');

module.exports = {

	generateParticipantId: function(){
		return AppInfoStore.getAppInfo().ip + '-' + navigator.userAgent;
	}

};