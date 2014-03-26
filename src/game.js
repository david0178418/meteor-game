define(function(require) {
	"use strict";
	var Phaser = require('phaser');

	var game = window.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser');

	return game;
});