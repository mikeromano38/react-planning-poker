var React = require('react');
var spinner = require('./spinner');

var RoomList = React.createClass({
	getInitialState: function(){
		return {
			rooms: []
		}
	},
	render: function(){
		var loading = null;
		if ( this.state.rooms.length === 0 ){
			loading = <Spinner />;
		}
		return (
			<div>
				{loading}
				<ul>
					{this.state.rooms.map(function(room) {
						return <RoomListItem roomName={room} />;
					})}
				</ul>
			</div>
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

var Spinner = React.createClass({
	componentDidMount: function(){
		spinner( 'spinner' );
	},
	render: function(){
		return (
			<div id="spinner" />
		)
	}
})

module.exports = function( target ){
	return React.render( <RoomList />, target );
};
