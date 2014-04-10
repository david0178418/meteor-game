define(function(require) {
	"use strict";

	var Phaser = require('phaser');

	function Hero(game) {
		var sprite = game.add.sprite(100, 100, 'hero-ground');
		this.game = game;
		this.sprite = sprite;
		this.flightToggleRegistered = false;
		
		sprite.animations.add('walk');
		sprite.loadTexture('hero-flying', 0);
		sprite.animations.add('fly');
		sprite.animations.play('walk', 20, true);
		sprite.anchor.setTo(0.5, 0.5);

		game.physics.enable(sprite, Phaser.Physics.ARCADE);
		sprite.body.allowRotation = false;
		sprite.body.collideWorldBounds = true;
		sprite.body.gravity.y = 400;
		//sprite.body.allowGravity = true;
		sprite.body.drag = new Phaser.Point(Hero.DRAG, Hero.DRAG);

		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			toggle: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
			dash: game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
		};

		//easy accessors
		this.drag = sprite.body.drag;
		this.velocity = sprite.body.velocity;
		this.acceleration = sprite.body.acceleration;
	}

	Hero.MAX_VELOCITY = 150;
	Hero.DRAG = 200;
	Hero.THRUST = 600;
	Hero.DASH_VELOCITY = 300;

	Hero.preload = function(game) {
		game.load.spritesheet('hero-flying', 'assets/images/hero-flying.png', 46, 46);
		game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
	};

	Hero.prototype = {
		update: function() {
			if(!this.flightToggleRegistered && this.controls.toggle.isDown) {
				this.toggleFlight();
			} else if(this.flightToggleRegistered && !this.controls.toggle.isDown) {
				this.flightToggleRegistered = false;
			}

			if(this.poweredUp && this.controls.dash.isDown) {
				this.userDash();
			} else {
				this.userFly();
			}
		},
		userDash: function() {
			var velocity = this.velocity,
				controls = this.controls,
				dashVelocity = Hero.DASH_VELOCITY,
				maxVelocity = Hero.MAX_VELOCITY,
				vx = 0,
				vy = 0;

			if (controls.up.isDown) {
				vy = -dashVelocity;
			} else if (controls.down.isDown) {
				vy = dashVelocity;
			}

			if (controls.left.isDown) {
				vx = -dashVelocity;
			} else if (controls.right.isDown) {
				vx = dashVelocity;
			}
			if(vx || vy) {
				velocity.x = vx;
				velocity.y = vy;	
			}
		},
		userFly: function() {
			var velocity = this.velocity,
				acceleration = this.acceleration,
				controls = this.controls,
				thrust = Hero.THRUST,
				maxVelocity = Hero.MAX_VELOCITY;

			if(this.poweredUp) {
				if (controls.up.isDown && velocity.y >= -maxVelocity) {
					acceleration.y = -thrust;
				} else if (controls.down.isDown &&  velocity.y <= maxVelocity) {
					acceleration.y = thrust;
				} else {
					acceleration.y = 0;
				}
			}

			if (controls.left.isDown && velocity.x >= -maxVelocity) {
				acceleration.x = -thrust;
			} else if (controls.right.isDown &&  velocity.x <= maxVelocity) {
				acceleration.x = thrust;
			} else {
				acceleration.x = 0;
			}
		},

		toggleFlight: function() {
			this.flightToggleRegistered = true;
			this.poweredUp = !this.poweredUp;
			var animation = this.poweredUp ? 'fly':'walk';
			this.sprite.play(animation, 20, true);
			this.sprite.body.allowGravity = !this.poweredUp;
		}
	};

	return Hero;
});