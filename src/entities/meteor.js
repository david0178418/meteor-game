define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	Meteor.preload = function(game) {
	};
	
	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, {
		constructor: Meteor,
		update: function(game) {
		}
	});
	
	function Meteor(data, game) {
		this.game = game;
		this.sprite = game.add.sprite(data.x, -50, 'meteor');
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

		this.sprite.body.allowRotation = false;
		this.sprite.body.collideWorldBounds=false;
		this.sprite.body.allowGravity = false;
		this.sprite.body.velocity.y = data.speed;
	}

	return Meteor;
});