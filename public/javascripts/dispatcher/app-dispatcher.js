var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = function(){
	//extend dispatcher here
};

AppDispatcher.prototype = new Dispatcher();

module.exports = new AppDispatcher();