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
		this.state.options = RoomsStore.getValues( this.getParams().id );
		this.setState( this.state );
	},

	selectCard: function( val ){
		debugger
		if ( this.props.cardsRevealed ){
			return;
		}

		RoomsActions.setSelectedForCurrentUser( val );
	},

	render: function(){
		var self = this;

		var cards = this.state.options.map(function( val ){
			var selected = ( self.state.selected === val ) ? 'selected' : '';
			var okSign = ( selected ) ? <span className="glyphicon glyphicon-ok"></span> : '';

			return (
				<li className="card-wrapper" key={val} onClick={self.selectCard.bind(self, val)}>
					<Card flipped={true} selected={selected} value={val}/>
					{okSign}
				</li>
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

		var className = '';
		className = className + ( ( this.props.flipped ) ? ' flipped' : '' );
		className = className + ( ( this.props.selected ) ? ' selected' : '' );

		var fontSize;
		var valLength = ( this.props.value ) ? this.props.value.length : 0;

		if ( valLength <= 4 ){
			fontSize = 24;
		} else if ( valLength > 4 && valLength < 8 ){
			fontSize = 14;
		} else {
			fontSize = 12;
		}

		var valueStyle = {
			fontSize: fontSize + 'px'
		};

		return (
			<div id="f1_container" className={className}>
				<div id="f1_card" className="shadow planning-card">
					<div className="front face">
						<div>{this.props.back}</div>
					</div>
					<div className="back face center">
						<p style={valueStyle}>{this.props.value}</p>
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