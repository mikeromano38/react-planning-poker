var firebaseConnection = require('../firebaseConnection');

var usersRef = firebaseConnection.child('/users');

function create( user ){
	return usersRef.push( user );
}

function remove( key ){
	var removeRef = firebaseConnection.child('/users/' + key );
	removeRef.remove();
}

module.exports = {
	create: create,
	remove: remove
};