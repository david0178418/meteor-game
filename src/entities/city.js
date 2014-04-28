define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage');
	
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
	
	City.HIT_POINTS = 4;
	City.preload = function(game) {
	};
	
	City.prototype = Object.create(Phaser.Sprite.prototype);
	
	_.extend(City.prototype, damageComponent(City.HIT_POINTS), {
		constructor: City,
		update: function(game) {
			if(!this.hitPoints) {
				this.kill();
				return;
			}
			
			this.height = this.hitPoints * 50;
		},
	});

	return City;
});