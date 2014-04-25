define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser');
	
	function Hero(game) {
		Phaser.Sprite.call(this, game, 100, 100, 'hero-ground');
		//this.game = game;
		this.flightToggleRegistered = false;
		
		/*this.animations.add('walk');
		this.loadTexture('hero-flying', 0);
		this.animations.add('fly');
		this.animations.play('walk', 20, true);*/
		this.anchor.setTo(0.5, 0.5);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.allowRotation = false;
		this.body.collideWorldBounds = true;
		this.body.gravity.y = 400;
		//this.body.allowGravity = true;
		this.body.drag = new Phaser.Point(Hero.DRAG, Hero.DRAG);

		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			toggle: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
			dash: game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
		};

		//easy accessors
		this.drag = this.body.drag;
		this.velocity = this.body.velocity;
		this.acceleration = this.body.acceleration;
	}
	
	Hero.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Hero.prototype, {
		constructor: Hero,
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
			//this.play(animation, 20, true);
			this.body.allowGravity = !this.poweredUp;
		}
	});
	
	Hero.MAX_VELOCITY = 150;
	Hero.DRAG = 200;
	Hero.THRUST = 600;
	Hero.DASH_VELOCITY = 300;

	Hero.preload = function(game) {
	};
	
	return Hero;
});