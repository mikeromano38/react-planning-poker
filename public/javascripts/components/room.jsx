var React = require('react');
var RoomsStore = require('../stores/rooms-store');
var Router = require('react-router');

var Room = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		return this.getStateFromStore( this.getParams().id ) || {};
	},

	componentDidMount: function(){
		RoomsStore.on('change', this.setStateFromStore );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener('change', this.setStateFromStore );
	},

	getStateFromStore: function(){
		return RoomsStore.getRoom( this.getParams().id );
	},

	setStateFromStore: function(){
		this.setState( this.getStateFromStore() );
	},

	render: function(){
		return(
			<div>
				<a onClick={this.navigateHome}>Back to home</a>
				<h1 title={ this.getParams().id }>Room { this.state.name }</h1>
			</div>
		)
	},

	navigateHome: function(){
		this.transitionTo( 'home' );
	}
});

module.exports = Room;

