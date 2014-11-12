var roomsComponent = require('./components/myscript.jsx');
var rooms = require('./rooms.js');
var roomsForm = require('./components/rooms-form.jsx');

var connection = rooms.connect();
var rc = roomsComponent( document.getElementById( 'rooms' ) );
roomsForm( document.getElementById( 'rooms-form' ) );

var roomData = [];

connection.on('child_added', function( snapshot ){
	roomData.push( snapshot.val() );
	rc.setState({rooms: roomData});
});



