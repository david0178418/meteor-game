define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		City = require('entities/city');

	function CityController(game) {
		this.game = game;
		this.cities = game.add.group();
		this.cities.add(new City({
			x: 100,
			y: game.height
		}, game));
		
		this.cities.add(new City({
			x: game.width / 2,
			y: game.height
		}, game));
		
		this.cities.add(new City({
			x: game.width - 100,
			y: game.height
		}, game));
	}

	CityController.prototype = {
		update: function(game) {
		},
	};
	
	CityController.preload = function(game) {
		City.preload(game);
	};

	return CityController;
});