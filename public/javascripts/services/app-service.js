var $ = require('jquery');
var AppServiceActions = require('../actions/app-service-actions');

module.exports = {
	getAppInfo: function(){
		return $.get( '/api/app' ).success(function( data ){
			AppServiceActions.appInfoLoaded( data );
		}).error(function( err ){
			console.log( err );
		});
	}
};