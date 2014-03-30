define(function(require) {
	"use strict";

	var Phaser = require('phaser'),
		Meteor = require('entities/meteor');

	function MeteorController(game) {
		this.meteors = game.add.group();
		this.baseInterval = 5000;
		this.intervalRange = 2000;
		this.nextSpawn = 3000;
		this.meteorSpeed = 300;
	}

	MeteorController.preload = function(game) {
		game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
	};

	MeteorController.prototype.update = function(game) {
		this.nextSpawn -= game.time.elapsed;

		if(this.nextSpawn < 0) {
			this.spawnMeteor(game);

			this.nextSpawn = this.baseInterval + ( this.intervalRange * Math.random() );
		}
	};

	MeteorController.prototype.spawnMeteor = function(game) {
		var meteor = new Meteor({
				x: game.world.width * Math.random(),
				angle: 0,
				speed: this.meteorSpeed
			},
			game);
		
		this.meteors.add(meteor.sprite);
	};

	MeteorController.prototype.collisionHandler = function(hero, meteor) {
		meteor.kill();
	};

	return MeteorController;
});