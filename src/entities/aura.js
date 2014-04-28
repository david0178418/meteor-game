define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function Aura(game) {
		Phaser.Sprite.call(this, game, 0, 0, 'aura');
		this.anchor.setTo(0.5, 0.5);
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = this.height = this.power = Aura.STARTING_POWER;
		// END
		this.alpha = 0.3;
		
		// TODO: tween needs to be set dynamica rather than set in stone.
		this.powerUp = game.add.tween(this).to({
			width: this.power,
			height: this.power
		}, 70, Phaser.Easing.Linear.None, false);
		this.powerDown = game.add.tween(this).to({
			width: 0,
			height: 0
		}, 200, Phaser.Easing.Linear.None, false);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.width = 0;
		this.height = 0;
	}
	
	Aura.STARTING_POWER = 100;
	
	Aura.preload = function(game) {
	};
	
	Aura.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Aura.prototype, {
		constructor: Aura,
		flareUp: function() {
			if(!this.powerUp.isRunning && !this.width) {
				this.powerUp.start();
			}
		},
		flareDown: function() {
			if(!this.powerDown.isRunning && this.width === this.power) {
				this.powerDown.start();
			}
		},
	});

	return Aura;
});