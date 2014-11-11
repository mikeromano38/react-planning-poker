var React = require('react');

var RoomList = React.createClass({
	getInitialState: function(){
		return {
			rooms: []
		}
	},
	render: function(){
		return (
			<ul>
				{this.state.rooms.map(function(room) {
					return <RoomListItem roomName={room} />;
				})}
			</ul>
			)
	}
});

var RoomListItem = React.createClass({
	render: function(){
		return (
			<li>{this.props.roomName}</li>
		)
	}
});

module.exports = function(){
	return React.render( <RoomList />, document.getElementById('greeting') );
};
