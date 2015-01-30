var connection = null;

var UsersService = function(){
	if (!connection){
		connection = new Firebase('https://romanocreative.firebaseio.com/users');
	}

	function create( user ){
		return connection.push( user );
	}

	function remove( key ){
		var removeRef = new Firebase('https://romanocreative.firebaseio.com/users/' + key );
		removeRef.remove();
	}

	return {
		create: create,
		remove: remove
	}
};

module.exports = UsersService;