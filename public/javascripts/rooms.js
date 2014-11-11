module.exports = (function(){

	var connection = null;

	function connect(){
		if (!connection){
			connection = new Firebase('https://romanocreative.firebaseio.com/rooms');
		}
		return connection;
	}

	return {
		connect: connect
	}

})();