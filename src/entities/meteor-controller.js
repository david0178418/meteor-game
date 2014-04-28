define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Meteor = require('entities/meteor');

	function MeteorController(game) {
		this.game = game;
		this.meteors = game.add.group();
		this.baseInterval = 1000;
		this.intervalRange = 2000;
		this.nextSpawn = 3000;
		this.meteorSpeed = 150;
		window.y = this.meteors;
	}

	MeteorController.prototype = {
		update: function(game) {
			this.nextSpawn -= game.time.elapsed;

			if(this.nextSpawn < 0) {
				this.spawnMeteor(game);

				this.nextSpawn = this.baseInterval + _.random(this.intervalRange);
			}
		},

		spawnMeteor: function() {
			var meteor = new Meteor({
					x: _.random(100, this.game.world.width - 100),
					angle: 0,
					speed: this.meteorSpeed
				},
				this.game);
			
			this.meteors.add(meteor);
		},
	};
	
	MeteorController.preload = function(game) {
		game.load.spritesheet('meteor', 'assets/images/meteor.png', 50, 50);
		Meteor.preload(game);
	};

	return MeteorController;
});