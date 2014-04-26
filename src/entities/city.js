define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function City(props, game) {
		Phaser.Sprite.call(this, game, props.x, props.y, 'city');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 50;
		this.height = 200;
		// END
		this.anchor.setTo(0.5, 1);
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
	}
	
	City.prototype = Object.create(Phaser.Sprite.prototype);
	
	_.extend(City.prototype, {
		constructor: City,
		update: function(game) {
		}
	});
	
	City.preload = function(game) {
	};

	return City;
});