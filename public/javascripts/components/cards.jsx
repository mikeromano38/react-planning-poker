var React = require('react');
var Router = require('react-router');
var RoomsActions = require('../actions/rooms-actions');
var RoomsStore = require('../stores/rooms-store');

var PokerHand = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		return {
			options: [],
			selected: null
		}
	},

	componentDidMount: function(){
		this.setStateFromStore();
		RoomsStore.on( 'change', this.setStateFromStore );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener( 'change', this.setStateFromStore );
	},

	setStateFromStore: function(){
		this.state.selected = RoomsStore.getCurrentUser().selected;
		debugger
		this.state.options = RoomsStore.getValues( this.getParams().id );
		this.setState( this.state );
	},

	selectCard: function( val ){
		if ( this.props.cardsRevealed ){
			return;
		}

		RoomsActions.setSelectedForCurrentUser( val );
	},

	render: function(){
		var self = this;

		var cards = this.state.options.map(function( val ){
			var selected = ( self.state.selected === val ) ? <span className="selected-indicator">&nbsp;&#10004;</span> : '';
			return (
				<li className="card-wrapper" key={val} onClick={self.selectCard.bind(self, val)}><Card value={val}/>{selected}</li>
			);
		});

		return (
			<ul className="poker-hand">
				{cards}
			</ul>
		);
	}
});

var Card = React.createClass({
	render: function(){
		return (
			<div className="planning-card">{this.props.value}</div>
		);
	}
});

module.exports = {
	PokerHand: PokerHand,
	Card: Card
};