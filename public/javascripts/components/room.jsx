var React = require('react');
var RoomsStore = require('../stores/rooms-store');
var Router = require('react-router');
var RoomsServerActions = require('../actions/rooms-server-actions');

var participant = null;

var RoomUserList = React.createClass({
	render: function(){
		var users = [];
		var self = this;

		for ( var user in this.props.users ) {
			this.props.users[ user ].key = user
			users.push( this.props.users[ user ] );
		}

		return (
			<ul>
				{users.map(function( user ){
					var displayValue = (user.selectedCard && self.props.revealCards) ? user.selectedCard : (user.selectedCard) ? "*" : "?";

					return <li key={user.key}>{user.name} <Card value={displayValue} /></li>
				})}
			</ul>
		);
	}
});

var PokerHand = React.createClass({
	getInitialState: function(){
		return {
			options: [1, 2, 3, 5, 8, 13],
			selected: null
		}
	},

	componentDidMount: function(){
		var self = this;

		participant.on("value", function( snapshot ){
			var state = self.state;
			state.selected = snapshot.val().selectedCard;
			this.setState( state );
		});
	},

	selectCard: function( val ){
		var state = this.state;
		state.selected = val;
		participant.update({selectedCard: val});
		this.setState( state );
	},

	render: function(){
		var self = this;

		var cards = this.state.options.map(function( val ){
			var selected = ( self.state.selected === val ) ? <span className="selected-indicator">&nbsp;&#10004;</span> : '';

			console.log( selected );
			return (
				<li className="card-wrapper" onClick={self.selectCard.bind(self, val)}><Card value={val}/>{selected}</li>
			);
		})

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

var Room = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	room: null,

	getInitialState: function(){
		var state = this.getRoomStateFromStore( this.getParams().id ) || {};
		state.participantName = null;
		state.selectedCard = null;
		return state;
	},

	componentDidMount: function(){
		RoomsStore.on('change', this.setStateFromStore );

		this.room = new Firebase( 'https://romanocreative.firebaseio.com/rooms/' + this.getParams().id  );
		var self = this;

		this.room.on("value", function( snapshot ){
			console.log( snapshot.val() );
			var state = snapshot.val();
			//state.participants = snapshot.val();
			state.participantName = self.state.participantName;
			//
			self.setState( state );
		});
	},

	componentWillUnmount: function(){
		this.leaveRoom();
		RoomsStore.removeListener('change', this.setStateFromStore );
	},

	getRoomStateFromStore: function(){
		return RoomsStore.getRoom( this.getParams().id ) || {};
	},

	setStateFromStore: function(){
		var state = this.getRoomStateFromStore();
			state.participantName = this.state.participantName;

		this.setState( state );
	},

	enterRoom: function(){
		participant = RoomsServerActions.addParticipant( this.getParams().id, this.state.participantName );
		participant.onDisconnect().remove();

		this.forceUpdate();
	},

	leaveRoom: function(){
		if ( participant ){
			console.log( 'removing participant', participant.name )
			participant.remove();
			participant = null;
		}
	},

	handleUserNameKeyup: function( evt ){
		var state = this.state;
		this.state.participantName = evt.target.value;

		this.setState( state );
	},

	revealCards: function(){
		this.room.update({revealCards: true})
	},

	resetCards: function(){
		var participants = new Firebase( 'https://romanocreative.firebaseio.com/rooms/' + this.getParams().id + '/participants'  );
		this.room.update({revealCards: false})
		participants.on("child_added", function( part ){
			part.ref().update({selectedCard: null})
		});
	},

	render: function(){
		var view;

		if ( participant ){
			view = (
				<div>
					<a onClick={this.navigateHome}>Back to home</a>
					<h1 title={ this.getParams().id }>Room { this.state.name } | user: {this.state.participantName}</h1>
					<PokerHand onCardSelect={this.setSelectedCard} />
					<button onClick={this.revealCards}>Reveal Cards</button>{(this.state.revealCards) ? "show cards" : "don't show cards"}
					<button onClick={this.resetCards}>Reset Cards</button>
					<RoomUserList users={this.state.participants} revealCards={this.state.revealCards}/>
				</div>
			);
		} else {
			view = (
				<div>
					<label>Enter a name to use in the planning room:</label>
					<input onChange={this.handleUserNameKeyup} value={this.state.participantName} placeholder="Enter Name"/>
					<button onClick={this.enterRoom}>Enter Room</button>
				</div>
			);
		}

		return view;
	},

	navigateHome: function(){
		this.transitionTo( 'home' );
	}
});

module.exports = Room;

