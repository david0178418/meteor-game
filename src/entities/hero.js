define(function(require) {
	"use strict";

	var Phaser = require('phaser');

	function Hero(game) {
		window.hero = this;
		this.thrust = 1900;

		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            powerUp: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            powerDown: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			toggleFlight: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};
		this.sprite = game.add.sprite(10, 10, 'hero-ground');
		this.sprite.animations.add('walk');
		this.sprite.loadTexture('hero-flying', 0);
		this.sprite.animations.add('fly');
		this.sprite.animations.play('fly', 20, true);
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

		this.sprite.body.allowRotation = false;
		this.sprite.body.collideWorldBounds=true;
		this.sprite.body.gravity.y = 1500;
		this.sprite.body.allowGravity = false;
		this.sprite.body.maxVelocity = new Phaser.Point(500, 500);
	}

	Hero.THRUST_INCREMENT = 40;
	Hero.MAX_INCREMENT = 5;
	Hero.DRAG = new Phaser.Point(900, 900);
	Hero.prototype.isFlying = true;
	Hero.prototype.charging = false;

	Hero.preload = function(game) {
		game.load.spritesheet('hero-flying', 'assets/images/hero-flying.png', 46, 46);
		game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
	};

	Hero.prototype.update = function(game) {
		this.power();
		this.sprite.body.drag = Hero.DRAG;
		this.userMove();
	};

	Hero.prototype.power = function() {
		if(this.controls.powerUp.isDown) {
			this.thrust += Hero.THRUST_INCREMENT;
			this.sprite.body.maxVelocity.x += Hero.MAX_INCREMENT;
			this.sprite.body.maxVelocity.y += Hero.MAX_INCREMENT;
		} else if(this.controls.powerDown.isDown) {
			this.thrust -= Hero.THRUST_INCREMENT;
			this.sprite.body.maxVelocity.x -= Hero.MAX_INCREMENT;
			this.sprite.body.maxVelocity.y -= Hero.MAX_INCREMENT;

			if(this.sprite.body.maxVelocity.x < 0) {
				this.sprite.body.maxVelocity.x = this.sprite.body.maxVelocity.y = 0;
			}

			if(this.thrust < 0) {
				this.thrust = 0;
			}
		}
	};

	Hero.prototype.userMove = function() {
		var sprite = this.sprite,
			controls = this.controls;

		if(controls.toggleFlight.isDown) {
			this.toggleFlight();
		}

		if (controls.up.isDown) {
			if(this.isFlying) {
				sprite.body.acceleration.y = -this.thrust;
			} else if (sprite.bottom > sprite.game.physics.arcade.bounds.bottom) {
				sprite.body.velocity.x = 3000;
			}
		} else if (controls.down.isDown) {
			sprite.body.acceleration.y = this.thrust;
		} else {
			sprite.body.acceleration.y = 0;
		}

		if (controls.left.isDown) {
			sprite.body.acceleration.x = -this.thrust;
		} else if (controls.right.isDown) {
			sprite.body.acceleration.x = this.thrust;
		} else {
			sprite.body.acceleration.x = 0;
		}
	};

	Hero.prototype.toggleFlight = function() {
		var animation = this.isFlying ? 'walk':'fly';

		this.isFlying = !this.isFlying;
		this.sprite.body.allowGravity = !this.isFlying;
		this.sprite.play(animation, 20, true);
	};



	return Hero;
});