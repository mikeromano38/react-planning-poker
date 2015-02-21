var React = require('react');
var RoomsStore = require('../stores/rooms-store');
var Router = require('react-router');
var RoomsActions = require('../actions/rooms-actions');

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
					var displayValue = (user.selected && self.props.revealCards) ? user.selected : (user.selected) ? "*" : "?";

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
		RoomsStore.on( 'change', this.setStateFromStore );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener( 'change', this.setStateFromStore );
	},

	setStateFromStore: function(){
		this.state.selected = RoomsStore.getCurrentUser().selected;
		this.setState( this.state );
	},

	selectCard: function( val ){
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

var Room = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		var room = RoomsStore.getRoom( this.getParams().id );
		var user = {
			name: null,
			selected: null
		};

		return {
			room: room,
			user: user
		};
	},

	componentDidMount: function(){
		RoomsStore.on( 'change', this.updateStateFromStore );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener('change', this.updateStateFromStore );
		this.leaveRoom();
	},

	updateStateFromStore: function(){
		var state = {
			room: RoomsStore.getRoom( this.getParams().id ),
			user : {
				name: this.state.user.name,
				selected: this.state.user.selected
			}
		};

		this.setState( state );
	},

	enterRoom: function( evt ){
		evt.preventDefault();
		RoomsActions.addUserToRoom( this.state.user, this.getParams().id );

	},

	leaveRoom: function(){
		if ( RoomsStore.getCurrentUser() ){
			RoomsActions.removeCurrentUser();
		}
	},

	handleUserNameKeyup: function( evt ){
		this.state.user.name = evt.target.value;
		this.setState( this.state );
	},

	revealCards: function(){
		RoomsActions.revealCardsForRoom( true, this.getParams().id );
	},

	resetCards: function(){
		RoomsActions.resetCardsForRoom( this.getParams().id );
	},

	navigateHome: function(){
		this.transitionTo( 'home' );
	},

	render: function(){
		var view;
		var currentUser = RoomsStore.getCurrentUser();

		if ( currentUser ){
			view = (
				<div>
					<h4><a onClick={this.navigateHome}>Back to home</a> | Welcome to Room { this.state.room.name }</h4>
					<PokerHand />
					<button onClick={this.revealCards}>Reveal Cards</button>
					<button onClick={this.resetCards}>Reset Cards</button>
					<RoomUserList users={this.state.room.participants} revealCards={this.state.room.revealCards}/>
				</div>
			);
		} else {
			view = (
				<div>
					<h4><a onClick={this.navigateHome}>Back to home</a> | Welcome to Room { this.state.room.name }</h4>
					<form className="form-inline">
						<div className="form-group">
							<label for="user-name">User Name:</label>
							<input onChange={this.handleUserNameKeyup} className="form-control" name="user-name" value={this.state.user.name} placeholder="Enter Your User Name"/>
						</div>
						<button onClick={this.enterRoom} className="btn btn-primary">Enter Room</button>
					</form>
				</div>
			);
		}

		return view;
	}
});

module.exports = Room;

