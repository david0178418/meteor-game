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
		Phaser.Sprite.call(this, game, data.x, -50 'meteor');
		this.anchor.setTo(0.5, 0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.body.allowRotation = false;
		this.body.collideWorldBounds=false;
		this.body.allowGravity = false;
		this.body.velocity.y = data.speed;
	}

	return Meteor;
});