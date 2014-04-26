define(function(require) {
	"use strict";
	var Phaser = require('phaser'),
		States = require('states'),
		MeteorController = require('entities/meteor-controller'),
		Hero = require('entities/hero'),
		CityController = require('entities/city-controller'),
		game = require('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		hero: null,
		preload: function(game) {
			Hero.preload(game);
			CityController.preload(game);
			MeteorController.preload(game);
		},
		create: function(game) {
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setShowAll();
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVeritcally = true;
			game.scale.refresh();

			window.addEventListener('resize', function() {
				game.scale.setShowAll();
				game.scale.refresh();
			});

			game.world.setBounds(0, 0, game.width, game.height);
			
			this.meteorController = new MeteorController(game);
			this.cityController = new CityController(game);
			this.hero = new Hero(game);
			game.add.existing(this.hero);
			game.stage.backgroundColor = '#333';
		},
		update: function(game) {
			game.physics.arcade.collide(this.hero, this.meteorController.meteors, this.collideHeroMeteor, null, this);
			
			game.physics.arcade.collide(this.meteorController.meteors, this.cityController.cities, this.collidemeteorCity, null, this);
			
			game.physics.arcade.collide(this.hero, this.cityController.cities);

			this.hero.update(game);
			this.meteorController.update(game);
		},
		paused: function() {
		},
		collideHeroMeteor: function(hero, meteor) {
			meteor.kill();
		},
		collideCityMeteor: function(meteor, city) {
			meteor.kill();
			city.kill();
		}
	});
});