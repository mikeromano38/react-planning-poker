var React = require('react');
var RoomsService = require('../services/rooms-service');
var RoomsForm = require('./rooms-form.jsx');
var StateStore = require('../stores/state-store');
var StateActions = require('../actions/state-actions');
var RoomsList = require('./rooms-list.jsx');

var PlanningPoker = React.createClass({

	getInitialState: function(){
		return {
			stateName: 'home'
		}
	},

	componentDidMount: function(){
		RoomsService();
		StateStore.on( 'state-changed', this.navigateToState );
	},

	render: function(){
		var pageContents;

		switch( this.state.stateName ){
			case 'room':
				pageContents = <div><a onClick={this.navigateHome}>Back to home</a><h1 title={this.state.room.key}>Room { this.state.room.name }</h1></div>;
				break;
			default:
				pageContents = <div><RoomsForm /><RoomsList /></div>;
				break;
		}

		return(
			<div>
				{pageContents}
			</div>
		)
	},

	navigateToState: function(){
		this.setState( StateStore.getStateInfo() );
	},

	navigateHome: function(){
		StateActions.navigateToState({ stateName: 'home' });
	}
});

module.exports = PlanningPoker;

