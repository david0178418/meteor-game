define(function(require) {
	"use strict";
	var States = require('states'),
		game = require('game');
	
	require('states/play');

	return function() {
		game.state.start(States.Play);
	};
});