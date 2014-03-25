define(function(require) {
	"use strict";
	var Phaser = require('phaser'),
		States = require('states'),
		Hero = require('entities/hero'),
		game = require('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		hero: null,
		preload: function(game) {
			game.load.image('background','assets/images/starfield.jpg');
			Hero.preload(game);
		},
		create: function(game) {
			game.add.tileSprite(0, 0, 2000, 2000, 'background');
			game.world.setBounds(0, 0, 1400, 1400);
			
			this.hero = new Hero(game);
		},
		update: function(game) {
			this.hero.update(game);
		},
		paused: function() {
		}
	});
});