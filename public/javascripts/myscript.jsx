var React = require('react');

module.exports = function(){
	var greeting = 'Hello There, World!';

	var Comp = React.createClass({
		render: function(){
			return (
				<h1>{greeting}</h1>
				)
		}
	});

	React.render( <Comp />, document.getElementById('greeting') );
};