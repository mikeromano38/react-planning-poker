var RoomsActions = require('../actions/rooms-actions');
var connection = null;

var RoomsService = function(){
	if (!connection){
		connection = new Firebase('https://romanocreative.firebaseio.com/rooms');

		connection.on('child_added', function( snapshot ){
			var room =  snapshot.val();
			room.key = snapshot.name();

			RoomsActions.roomLoaded( room );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});

		connection.on('child_removed', function( snapshot ){
			var key = snapshot.name();
			RoomsActions.removeRoom( key );
		}, function( err ){
			RoomsActions.roomLoadedFailure( err );
		});
	}

	function create( room ){
		return connection.push( room );
	}

	function remove( key ){
		var removeRef = new Firebase('https://romanocreative.firebaseio.com/rooms/' + key );
		removeRef.remove();
	}

	function setSelectedCard( key, id, cardVal ){
		var participant = new Firebase( 'https://romanocreative.firebaseio.com/rooms/' + key + '/participants/' + id );
		participant.selectedCard = cardVal;
	}

	function addParticipant( key, name ){
		var participants = new Firebase( 'https://romanocreative.firebaseio.com/rooms/' + key + '/participants' );
		return participants.push({ name: name });
	}

	function removeParticipant( key, participantId ){
		var participant = new Firebase( 'https://romanocreative.firebaseio.com/rooms/' + key + '/participants/' + participantId );
		participant.remove();
	}

	return {
		create: create,
		addParticipant: addParticipant,
		remove: remove,
		setSelectedCard: setSelectedCard
	}

};

module.exports = RoomsService;