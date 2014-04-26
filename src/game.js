define(function(require) {
	"use strict";
	var Phaser = require('phaser'),
		CONFIG = require('config');

	var game = window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser');
	return game;
});