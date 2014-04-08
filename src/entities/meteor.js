define(function(require) {
	"use strict";

	var Phaser = require('phaser');

	function Meteor(data, game) {
		this.game = game;
		this.sprite = game.add.sprite(data.x, -50, 'hero-ground');
		this.sprite.animations.add('walk');
		this.sprite.animations.play('walk', 20, true);
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

		this.sprite.body.allowRotation = false;
		this.sprite.body.collideWorldBounds=false;
		this.sprite.body.allowGravity = false;
		this.sprite.body.velocity.y = data.speed;
	}

	Meteor.prototype = {
		preload: function(game) {
			game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
		},
		update: function(game) {
			var sprite = this.sprite;
		}
	};

	return Meteor;
});