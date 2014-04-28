define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function Aura(game) {
		Phaser.Sprite.call(this, game, 0, 0, 'aura');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 300;
		this.height = 300;
		// END
		this.anchor.setTo(0.5, 0.5);
		this.alpha = 0.3;
		
		this.powerUp = game.add.tween(this).to({
			width: 300,
			height: 300
		}, 70, Phaser.Easing.Linear.None, false);
		this.powerDown = game.add.tween(this).to({
			width: 0,
			height: 0
		}, 200, Phaser.Easing.Linear.None, false);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.width = 0;
		this.height = 0;
	}
	
	Aura.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Aura.prototype, {
		constructor: Aura,
		flareUp: function() {
			if(!this.powerUp.isRunning && !this.width) {
				this.powerUp.start();
			}
		},
		flareDown: function() {
			if(!this.powerDown.isRunning && this.width === 300) {
				this.powerDown.start();
			}
		},
	});
	
	Aura.preload = function(game) {
	};

	return Aura;
});