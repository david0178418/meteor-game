define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage');
	
	function Building(props, game) {
		Phaser.Sprite.call(this, game, props.x, props.y, 'city');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 50;
		this.height = 200;
		// END
		this.anchor.setTo(0.5, 1);
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
	}
	
	Building.HIT_POINTS = 4;
	Building.preload = function(game) {
	};
	
	Building.prototype = Object.create(Phaser.Sprite.prototype);
	
	_.extend(Building.prototype, damageComponent(Building.HIT_POINTS), {
		constructor: Building,
		update: function() {
			if(!this.hitPoints) {
				this.kill();
				return;
			}
			
			this.height = this.hitPoints * 50;
		},
	});

	return Building;
});