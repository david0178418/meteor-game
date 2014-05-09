define(function(require) {
	"use strict";
	//TODO Need better place to organize since not really an entity.  Maybe "interface" folder?
	var _ = require('lodash'),
		Phaser = require('phaser');

	function Hud(game, hero) {
		this.game = game;
		this.hero = hero;
		this.currentHealth = hero.hitPoints;
		this.healthMsg = game.add.text(20, 20, 'Health: '+hero.hitPoints, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		this.powerMsg = game.add.text(20, 60, 'Power: '+hero.power, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		
		this.healthMsg.fixedToCamera = true;
		this.powerMsg.fixedToCamera = true;
		
		window.y = this;	//debug
	}

	Hud.prototype = {
		update: function() {
			var hero = this.hero;
			
			if(this.currentHealth !== hero.hitPoints) {
				this.healthMsg.text = 'Health: '+hero.hitPoints;
				this.currentHealth = hero.hitPoints
			}
			
			if(this.currentPower !== hero.power) {
				this.powerMsg.text = 'Power: '+hero.power;
				this.currentPower = hero.power
			}
		},
	};
	
	Hud.preload = function(game) {
		
	};

	return Hud;
});