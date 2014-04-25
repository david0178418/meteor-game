define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function Meteor(props, game) {
		Phaser.Sprite.call(this, game, props.x, -50, 'meteor');
		this.anchor.setTo(0.5, 0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.body.allowRotation = false;
		this.body.collideWorldBounds=false;
		this.body.allowGravity = false;
		this.body.velocity.y = props.speed;
	}
	
	Meteor.preload = function(game) {
	};
	
	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, {
		constructor: Meteor,
		update: function(game) {
		}
	});

	return Meteor;
});