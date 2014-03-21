define(function(require) {
	"use strict";
	var Phaser = require('phaser'),
		States = require('states'),
		game = require('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		fixed: null,
		hero: null,
		thrust: 1900,
		controls: {
			up: null,
			down: null,
			left: null,
			right: null,
		},
		preload: function(game) {
			game.load.spritesheet('hero', 'assets/images/hero.png', 46, 46);
			game.load.image('background','assets/images/starfield.jpg');
		},
		create: function(game) {
			game.add.tileSprite(0, 0, 2000, 2000, 'background');
			game.world.setBounds(0, 0, 1400, 1400);
			
			var hero = this.hero = game.add.sprite(10, 10, 'hero');
			hero.animations.add('flicker');
			hero.animations.play('flicker', 20, true);
			hero.anchor.setTo(0.5, 0.5);
			game.physics.enable(hero, Phaser.Physics.ARCADE);
			hero.body.allowRotation = false;
			hero.body.drag.set(900, 900);
			this.hero.body.maxVelocity.set(500, 500);
			
			this.controls.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
			this.controls.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
			this.controls.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
			this.controls.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
			
			game.camera.follow(hero);
		},
		update: function(game) {
			if (game.input.mousePointer.isDown) {
			this.hero.body.maxVelocity.set(1500, 1500);
				game.physics.arcade.moveToXY(this.hero, game.input.mousePointer.worldX, game.input.mousePointer.worldY, 700);
			} else {
				
				this.hero.body.maxVelocity.set(500, 500);
				if (this.controls.up.isDown) {
					this.hero.body.acceleration.y = -this.thrust;
				} else if (this.controls.down.isDown) {
					this.hero.body.acceleration.y = this.thrust;
				} else {
					this.hero.body.acceleration.y = 0;
				}

				if (this.controls.left.isDown) {
					this.hero.body.acceleration.x = -this.thrust;
				} else if (this.controls.right.isDown) {
					this.hero.body.acceleration.x = this.thrust;
				} else {
					this.hero.body.acceleration.x = 0;
				}
			}
			this.hero.body.checkWorldBounds();
		},
		render: function() {
		},
		paused: function() {
		}
	});
});