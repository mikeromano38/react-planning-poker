var React = require('react');
var Modal = require('react-bootstrap').Modal;

var PokerModal = React.createClass({
	render: function(){
		return (
			<Modal onRequestHide={this.props.onRequestHide} bsStyle="primary" backdrop={true} title={this.props.title}>
				<div className="modal-body">
					{this.props.content}
				</div>
			</Modal>
		)
	}
});

module.exports = PokerModal;