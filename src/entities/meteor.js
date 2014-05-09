define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage');
	
	function Meteor(props, game) {
		Phaser.Sprite.call(this, game, props.x, Meteor.SPAWN_HEIGHT, 'meteor');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 75;
		this.height = 75;
		// END
		this.anchor.setTo(0.5, 0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.body.allowRotation = false;
		this.body.collideWorldBounds=false;
		this.body.allowGravity = true;
		this.body.gravity.y = 150;
		this.body.drag.x = this.body.drag.y = 100;
		this.startFall(props);
	}
	
	Meteor.SPAWN_HEIGHT = -50;
	Meteor.TOUGHNESS = 10;
	Meteor.MAX_VELOCITY = 200;
	
	Meteor.preload = function(game) {
		game.load.image('meteor', '');
	};
	
	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, damageComponent(Meteor.TOUGHNESS), {
		constructor: Meteor,
		update: function() {
			if(this.y > this.game.world.height) {
				this.kill();
			}
		},
		startFall: function(props) {
			this.reset(props.x, Meteor.SPAWN_HEIGHT);
			this.hitPoints = Meteor.TOUGHNESS;
		}
	});

	return Meteor;
});