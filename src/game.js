define(function(require) {
	"use strict";
	var Phaser = require('phaser');

	var game = window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser');

	return game;
});