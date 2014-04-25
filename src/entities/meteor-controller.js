define(function(require) {
	"use strict";

	var Phaser = require('phaser'),
		Meteor = require('entities/meteor');

	function MeteorController(game) {
		this.game = game;
		this.meteors = game.add.group();
		this.baseInterval = 5000;
		this.intervalRange = 2000;
		this.nextSpawn = 3000;
		this.meteorSpeed = 300;
	}

	MeteorController.prototype = {
		preload: function() {
			this.game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
		},

		update: function(game) {
			this.nextSpawn -= game.time.elapsed;

			if(this.nextSpawn < 0) {
				this.spawnMeteor(game);

				this.nextSpawn = this.baseInterval + ( this.intervalRange * Math.random() );
			}
		},

		spawnMeteor: function() {
			var meteor = new Meteor({
					x: this.game.world.width * Math.random(),
					angle: 0,
					speed: this.meteorSpeed
				},
				this.game);
			
			this.meteors.add(meteor);
		},

		collisionHandler: function(hero, meteor) {
			meteor.kill();
		}
	};

	return MeteorController;
});