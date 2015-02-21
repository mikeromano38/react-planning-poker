var firebaseConnection = require('../firebaseConnection');

var roomsRef = firebaseConnection.child('/rooms');

//roomsRef.on('value', function( snapshot ){
//	var room =  snapshot.val();
//	room.key = snapshot.name();
//
//	RoomsActions.roomLoaded( room );
//}, function( err ){
//	RoomsActions.roomLoadedFailure( err );
//});

//roomsRef.on('child_removed', function( snapshot ){
//	var key = snapshot.name();
//	RoomsActions.removeRoom( key );
//}, function( err ){
//	RoomsActions.roomLoadedFailure( err );
//});


function create( room ){
	return roomsRef.push( room );
}

function remove( key ){
	var removeRef = firebaseConnection.child( '/rooms/' + key );
	removeRef.remove();
}

function setSelectedCard( key, id, cardVal ){
	var participant = firebaseConnection.child( '/rooms/' + key + '/participants/' + id );
	participant.set({ selectedCard: cardVal });
}

function addParticipant( key, name ){
	var participants = firebaseConnection.child( '/rooms/' + key + '/participants' );
	return participants.push({ name: name });
}

function removeParticipant( key, participantId ){
	var participant = firebaseConnection.child( '/rooms/' + key + '/participants/' + participantId );
	participant.remove();
}

module.exports = {
	create: create,
	addParticipant: addParticipant,
	remove: remove,
	setSelectedCard: setSelectedCard
};