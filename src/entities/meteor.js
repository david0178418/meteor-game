define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function Meteor(props, game) {
		Phaser.Sprite.call(this, game, props.x, -50, 'meteor');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 50;
		this.height = 50;
		// END
		this.anchor.setTo(0.5, 0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.body.allowRotation = false;
		this.body.collideWorldBounds=false;
		this.body.allowGravity = true;
		this.body.velocity.y = props.speed;
	}
	
	Meteor.preload = function(game) {
		game.load.image('meteor', '');
	};
	
	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, {
		constructor: Meteor,
		update: function() {
			if(this.y > this.game.height) {
				this.kill();
			}
		}
	});

	return Meteor;
});