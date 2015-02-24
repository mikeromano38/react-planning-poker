var React = require('react');
var Router = require('react-router');
var RoomsActions = require('../actions/rooms-actions');
var RoomsStore = require('../stores/rooms-store');

var PokerHand = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		return {
			options: [],
			room: null,
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
		this.state.room = RoomsStore.getRoom( this.getParams().id );
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
		var revealed = this.state.room && this.state.room.revealCards;

		var cards = this.state.options.map(function( val ){
			var selected = ( self.state.selected === val ) ? <span className="selected-indicator">&nbsp;&#10004;</span> : '';
			return (
				<li className="card-wrapper" key={val} onClick={self.selectCard.bind(self, val)}><Card flipped={revealed} value={val}/>{selected}</li>
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

		var className = ( this.props.flipped ) ? 'flipped' : '';

		return (
			<div id="f1_container" className={className}>
				<div id="f1_card" className="shadow planning-card">
					<div className="front face">
						<div>?</div>
					</div>
					<div className="back face center">
						<p>{this.props.value}</p>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = {
	PokerHand: PokerHand,
	Card: Card
};