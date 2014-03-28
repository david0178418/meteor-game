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
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setShowAll();
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVeritcally = true;
			game.scale.refresh();

			window.addEventListener('resize', function() {
				game.scale.setShowAll();
				game.scale.refresh();
			});

			game.add.tileSprite(0, 0, 1100, 1100, 'background');
			game.world.setBounds(0, 0, 1024, 768);
			
			this.hero = new Hero(game);
		},
		update: function(game) {
			this.hero.update(game);
		},
		paused: function() {
		}
	});
});