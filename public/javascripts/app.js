var roomsComponent = require('./myscript.jsx');
var rooms = require('./rooms.js');

var connection = rooms.connect();
var rc = roomsComponent();

//connection.push({ name: 'My roomy room' });
//connection.push({ name: 'My roomy room2' });
//connection.push({ name: 'My roomy room3' });
//connection.push({ name: 'My roomy room4' });
//connection.push({ name: 'My roomy room5' });

var roomData = [];

connection.on('child_added', function( snapshot ){
	roomData.push( snapshot.val() );
	rc.setState({rooms: roomData});
});

