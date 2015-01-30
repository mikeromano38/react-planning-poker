var UsersService = require('../services/users-service');

var UserServerActions = {

	createUser: function( user ){
		var usersService = UsersService();
		return usersService.create( user );
	}

};

module.exports = UserServerActions;