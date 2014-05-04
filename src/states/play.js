define(function(require) {
	"use strict";
	var Phaser = require('phaser'),
		States = require('states'),
		MeteorController = require('entities/meteor-controller'),
		Hero = require('entities/hero'),
		BuildingController = require('entities/building-controller'),
		game = require('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		hero: null,
		preload: function(game) {
			Hero.preload(game);
			BuildingController.preload(game);
			MeteorController.preload(game);
		},
		create: function(game) {
			game.physics.startSystem(Phaser.Physics.ARCADE);
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
			this.buildingController = new BuildingController(game);
			this.hero = new Hero(game);
			game.add.existing(this.hero);
			game.stage.backgroundColor = '#333';
		},
		update: function(game) {
			game.physics.arcade.collide(this.hero, this.meteorController.meteors, this.collideHeroMeteor, null, this);
			
			game.physics.arcade.collide(this.meteorController.meteors, this.buildingController.cities, this.collideBuildingMeteor, null, this);
			game.physics.arcade.collide(this.meteorController.meteors, this.meteorController.meteors, function(meteorA, meteorB) {
				meteorA.kill();
				meteorB.kill();
			}, null, this);
			
			this.game.physics.arcade.collide(this.hero, this.buildingController.cities);

			this.hero.update(game);
			this.meteorController.update(game);
		},
		paused: function() {
		},
		collideHeroAuraMeteor: function(particle, meteor) {
			particle.kill();
			meteor.damage(1);
			
			if(meteor.isDead()) {
				meteor.kill();
			}
			
			return false; //use as process if intersecting to prevent physics interaction
		},
		collideHeroMeteor: function(hero, meteor) {
			var meteorTouching = meteor.body.touching;
			
			
			if(meteorTouching.right) {
				meteor.body.velocity.x = -300;
				meteor.body.velocity.y = -100;
				
				hero.stun();
				hero.velocity.x = 300;
			} else if(meteorTouching.left) {
				meteor.body.velocity.x = 300;
				meteor.body.velocity.y = -100;
				
				hero.stun();
				hero.velocity.x = -300;
			} else {
				meteor.kill();
				
				if(meteorTouching.down) {
					hero.stun();
					hero.velocity.y = 500;
				}
			}
		},
		collideBuildingMeteor: function(meteor, building) {
			meteor.kill();
			building.damage(1);
		}
	});
});