define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		Phaser = require('phaser'),
		States = require('states'),
		MeteorController = require('entities/meteor-controller'),
		Hero = require('entities/hero'),
		BuildingController = require('entities/building-controller'),
		Hud = require('entities/hud'),
		game = require('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		hero: null,
		preload: function(game) {
			Hero.preload(game);
			BuildingController.preload(game);
			MeteorController.preload(game);
			Hud.preload(game);
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

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			this.meteorController = new MeteorController(game);
			this.buildingController = new BuildingController(game);
			this.hero = new Hero(game);
			this.hud = new Hud(game, this.hero);
			game.add.existing(this.hero);
			game.stage.backgroundColor = '#333';
			
			game.camera.follow(this.hero);
		},
		update: function(game) {
			game.physics.arcade.collide(this.hero, this.meteorController.meteors, this.collideHeroMeteor, null, this);
			game.physics.arcade.collide(this.meteorController.meteors, this.buildingController.cities, this.collideBuildingMeteor, null, this);
			game.physics.arcade.collide(this.meteorController.meteors, this.meteorController.meteors, this.collideMeteorMeteor, null, this);
			
			this.game.physics.arcade.collide(this.hero, this.buildingController.cities);

			//this.hero.update(game);	??Why is this updating
			this.meteorController.update(game);
			this.hud.update(game);
		},
		paused: function() {
		},
		collideMeteorMeteor: function(meteorA, meteorB) {
			meteorA.kill();
			meteorB.kill();
		},
		collideHeroMeteor: function(hero, meteor) {
			var meteorTouching;
			
			if(hero.poweredUp) {
				meteor.kill();
				hero.stop();
				return;
			}		
			
			hero.stun();
			meteorTouching = meteor.body.touching;
			
			if(meteorTouching.right) {
				meteor.body.velocity.x = -300;
				meteor.body.velocity.y = -100;
				
				hero.velocity.x = 300;
			} else if(meteorTouching.left) {
				meteor.body.velocity.x = 300;
				meteor.body.velocity.y = -100;
				
				hero.velocity.x = -300;
			} else {
				meteor.kill();
				
				if(meteorTouching.down) {
					hero.velocity.y = 400;
				} else {
					hero.velocity.y = -200;
				}
			}
		},
		collideBuildingMeteor: function(meteor, building) {
			meteor.kill();
			building.damage(1);
		}
	});
});