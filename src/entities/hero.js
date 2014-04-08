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

		this.fly = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			toggle: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};
		this.dash = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
			left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
		},

		//easy accessors
		this.drag = sprite.body.drag;
		this.velocity = sprite.body.velocity;
		this.acceleration = sprite.body.acceleration;
	}

	Hero.MAX_VELOCITY = 150;
	Hero.DRAG = 100;
	Hero.THRUST = 600;
	Hero.DASH_VELOCITY = 300;

	Hero.preload = function(game) {
		game.load.spritesheet('hero-flying', 'assets/images/hero-flying.png', 46, 46);
		game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
	};

	Hero.prototype = {
		update: function() {
			if(!this.flightToggleRegistered && this.fly.toggle.isDown) {
				this.toggleFlight();
			} else if(this.flightToggleRegistered && !this.fly.toggle.isDown) {
				this.flightToggleRegistered = false;
			}

			if(this.poweredUp) {
				this.userDash();
				this.userFly();
			}
		},
		userDash: function() {
			var velocity = this.velocity,
				dash = this.dash,
				dashVelocity = Hero.DASH_VELOCITY,
				maxVelocity = Hero.MAX_VELOCITY,
				vx = 0,
				vy = 0;

			if (dash.up.isDown) {
				vy = -dashVelocity;
			} else if (dash.down.isDown) {
				vy = dashVelocity;
			}

			if (dash.left.isDown) {
				vx = -dashVelocity;
			} else if (dash.right.isDown) {
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
				fly = this.fly,
				thrust = Hero.THRUST,
				maxVelocity = Hero.MAX_VELOCITY;

			if (fly.up.isDown && velocity.y >= -maxVelocity) {
				acceleration.y = -thrust;
			} else if (fly.down.isDown &&  velocity.y <= maxVelocity) {
				acceleration.y = thrust;
			} else {
				acceleration.y = 0;
			}

			if (fly.left.isDown && velocity.x >= -maxVelocity) {
				acceleration.x = -thrust;
			} else if (fly.right.isDown &&  velocity.x <= maxVelocity) {
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