define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function Aura(game) {
		Phaser.Particles.Arcade.Emitter.call(this, game, 0, 0);
		
		this.makeParticles('aura');
		this.setRotation(0, 0);
		this.setAlpha(1, 0, Aura.LIFE_SPAN);
		this.setScale(1, 0, 1, 0, Aura.LIFE_SPAN);
		this.minParticleSpeed.set(0, 0);
		this.maxParticleSpeed.set(0, 0);
		this.gravity = 0;
	}
	
	Aura.LIFE_SPAN = 700;
	
	Aura.preload = function(game) {
		game.load.image('aura', 'assets/images/aura.png');
	};
	
	Aura.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
	_.extend(Aura.prototype, {
		constructor: Aura,
		flareUp: function(x, y) {
			this.x = x;
			this.y = y;
			this.start(true, Aura.LIFE_SPAN, 8);
		}
	});

	return Aura;
});