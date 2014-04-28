define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Building = require('entities/building');

	function BuildingController(game) {
		this.game = game;
		this.cities = game.add.group();
		this.cities.add(new Building({
			x: 100,
			y: game.height
		}, game));
		
		this.cities.add(new Building({
			x: game.width / 2,
			y: game.height
		}, game));
		
		this.cities.add(new Building({
			x: game.width - 100,
			y: game.height
		}, game));
	}

	BuildingController.prototype = {
		update: function(game) {
		},
	};
	
	BuildingController.preload = function(game) {
		Building.preload(game);
	};

	return BuildingController;
});