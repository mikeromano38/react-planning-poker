var React = require('react');
var RoomsStore = require('../stores/rooms-store');
var Router = require('react-router');
var RoomsActions = require('../actions/rooms-actions');
var Card = require('./cards.jsx').Card;
var PokerHand = require('./cards.jsx').PokerHand;
var Modal = require('./modal.jsx');

var EstimationResults = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		return {
			options: []
		}
	},

	componentDidMount: function(){
		this.updateStateFromStore();
		RoomsStore.on('change', this.updateStateFromStore );
	},

	componentWillUnmount: function(){
		RoomsStore.removeListener('change', this.updateStateFromStore);
	},

	updateStateFromStore: function(){
		this.setState({
			options: RoomsStore.getEstimationResultsForRoom( this.getParams().id )
		});
	},

	render: function(){
		var self = this;

		var results = this.state.options.map(function( option ){

			var modes = self.state.options.modes.filter(function( mode ){
				return mode.val === option.val;
			});

			var className = ( modes.length ) ? 'mode' : '';

			return (
				<tr className={className}><td>{option.val}</td><td>{option.numVotes}</td></tr>
			);
		});

		return (
			<table className="table results-table">
				<thead>
					<tr>
						<th>Value</th>
						<th>Votes</th>
					</tr>
				</thead>
				<tbody>
					{results}
				</tbody>
			</table>
		);
	}
});

var RoomUserList = React.createClass({
	render: function(){
		var users = [];
		var self = this;

		for ( var user in this.props.users ) {
			this.props.users[ user ].key = user
			users.push( this.props.users[ user ] );
		}

		return (
			<ul className="room-user-list">
				{users.map(function( user ){

					var splitName = user.name.trim().split(' ');

					splitName = splitName.filter(function( part ){
						return part.trim();
					});

					splitName = splitName.map(function( part ){
						return <span className="username">{part}</span>;
					});

					var flipped = self.props.revealed && user.selected;
					var displayValue = user.selected;
					var className = ( user.selected ) ? 'user-selected' : '';

					var backClass = ( user.selected ) ? 'glyphicon glyphicon-ok-sign' : 'glyphicon glyphicon-question-sign';
					var back = <span className={backClass}></span>;

					return <li key={user.key} className={className}> {splitName} <Card flipped={flipped} back={back} value={displayValue} /></li>
				})}
			</ul>
		);
	}
});

var Room = React.createClass({

	mixins: [ Router.Navigation, Router.State ],

	getInitialState: function(){
		var room = RoomsStore.getRoom( this.getParams().id ) || {};
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
				name: ( RoomsStore.getRandomName() ) ? RoomsStore.getRandomName() : this.state.user.name,
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
		var currentUser = RoomsStore.getCurrentUser();

		if ( currentUser ){
			RoomsActions.removeCurrentUser();
		}
	},

	handleUserNameKeyup: function( evt ){
		this.state.user.name = evt.target.value;
		this.setState( this.state );
	},

	revealCards: function(){
		this.state.modalOpen = true;
		RoomsActions.revealCardsForRoom( true, this.getParams().id );
	},

	hideCards: function(){
		RoomsActions.revealCardsForRoom( false, this.getParams().id );
	},

	resetCards: function(){
		RoomsActions.resetCardsForRoom( this.getParams().id );
	},

	navigateHome: function(){
		this.leaveRoom();
		this.transitionTo( 'home' );
	},

	createAnonymousNameForRoom: function( evt ){
		evt.preventDefault();
		RoomsActions.createAnonymousNameForRoom( this.getParams().id );
		this.forceUpdate();
	},

	hideModal: function(){
		this.state.modalOpen = false;
		this.forceUpdate();
	},

	render: function(){
		var view;
		var currentUser = RoomsStore.getCurrentUser();
		var nameGenerationContents = ( RoomsStore.nameIsGenerating() ) ? <span>Generating...</span> :
			( RoomsStore.getRandomName() ) ? <span>Generate Another</span> : <span>Generate Anonymous Name</span>;


		if ( currentUser ){

			var revealBtn;
			var modal = '';
			var results;
			var resultsModel = RoomsStore.getEstimationResultsForRoom( this.getParams().id );

			if ( !this.state.room.revealCards ){
				revealBtn = <button onClick={this.revealCards} className="btn btn-primary">Reveal Cards</button>
			} else  {
				revealBtn = <button onClick={this.hideCards} className="btn btn-primary">Hide Cards</button>
			}

			if ( this.state.room.revealCards && resultsModel.votes.length ){

				if ( !resultsModel.mode || !this.state.modalOpen || Number( resultsModel.mode.val ) <= 3 || !RoomsStore.easterEggsEnabled() ){
					results = <EstimationResults />;
				}

				if ( resultsModel.mode && Number( resultsModel.mode.val ) > 3 && this.state.modalOpen && RoomsStore.easterEggsEnabled() ){
					var content = (
						<div>
							<h4>Would you like to consider a lower estimation value? Perhaps a 3?</h4>
							{<EstimationResults />}
							<img src="/images/milan.png" />
						</div>
					);

					modal = (
						<Modal title="Team, estimation too high!" content={content} onRequestHide={this.hideModal}></Modal>
					)
				}
			}

			view = (
				<div className="col-sm-12">
					{modal}
					<h3>Welcome { currentUser.name }!</h3>
					<h4 className="room-heading"><a onClick={this.navigateHome} onTouchStart={this.navigateHome}>Back to home</a> | Welcome to Room { this.state.room.name }</h4>
					<PokerHand cardsRevealed={this.state.room.revealCards && resultsModel.votes.length} />
					{revealBtn}
					<button onClick={this.resetCards} className="btn btn-primary">Reset Cards</button>
					<RoomUserList revealed={this.state.room.revealCards} users={this.state.room.participants} revealCards={this.state.room.revealCards}/>
					{results}
				</div>
			);
		} else {
			view = (
				<div className="col-sm-12">
					<h4 className="room-heading"><a onClick={this.navigateHome} onTouchStart={this.navigateHome}>Back to home</a> | Welcome to Room { this.state.room.name }</h4>
					<form lassName="col-sm-12 col-med-6">
						<div className="form-group">
							<label for="user-name">Username:</label>
							<input onChange={this.handleUserNameKeyup} className="form-control" name="user-name" value={this.state.user.name} placeholder="ex. BieberFever808"/>
						</div>
						<button onClick={this.enterRoom} className="btn btn-primary">Enter Room</button>
						<button onClick={this.createAnonymousNameForRoom} className="btn btn-primary">{nameGenerationContents}</button>
					</form>
				</div>
			);
		}

		return view;
	}
});

module.exports = Room;

