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
			self.setState( state );
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
			return (
				<li className="card-wrapper" key={val} onClick={self.selectCard.bind(self, val)}><Card value={val}/>{selected}</li>
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
			var state = snapshot.val();
			//state.participants = snapshot.val();
			state.participantName = self.state.participantName;
			self.setState( state );
		});
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener('change', this.setStateFromStore );
		this.leaveRoom();
	},

	getRoomStateFromStore: function(){
		return RoomsStore.getRoom( this.getParams().id ) || {};
	},

	setStateFromStore: function(){
		var state = this.getRoomStateFromStore();
			state.participantName = this.state.participantName;

		this.setState( state );
	},

	enterRoom: function( evt ){
		evt.preventDefault();

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
					<h4 title={ this.getParams().id }><a onClick={this.navigateHome}>Back to home</a> | Welcome to Room { this.state.name }</h4>
					<PokerHand onCardSelect={this.setSelectedCard} />
					<button onClick={this.revealCards}>Reveal Cards</button>{(this.state.revealCards) ? "show cards" : "don't show cards"}
					<button onClick={this.resetCards}>Reset Cards</button>
					<RoomUserList users={this.state.participants} revealCards={this.state.revealCards}/>
				</div>
			);
		} else {
			view = (
				<div>
					<h4 title={ this.getParams().id }><a onClick={this.navigateHome}>Back to home</a> | Welcome to Room { this.state.name }</h4>
					<form className="form-inline">
						<div className="form-group">
							<label for="user-name">User Name:</label>
							<input onChange={this.handleUserNameKeyup} className="form-control" name="user-name" value={this.state.participantName} placeholder="Enter Your User Name"/>
						</div>
						<button onClick={this.enterRoom} className="btn btn-primary">Enter Room</button>
					</form>
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

