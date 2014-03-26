define(function(require) {
	"use strict";

	var Phaser = require('phaser');

	function Hero(game) {
		window.hero = this;
		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
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
	}

	Hero.THRUST = 1900;
	Hero.DRAG = new Phaser.Point(900, 900);
	Hero.DASH_DRAG = new Phaser.Point(0, 0);
	Hero.MAX_VELOCITY = new Phaser.Point(500, 500);
	Hero.DASH_MAX_VELOCITY = new Phaser.Point(2000, 2000);
	Hero.prototype.isFlying = false;
	Hero.prototype.charging = false;
	Hero.prototype.dashing = false;
	Hero.prototype.dashTarget = {x:0, y:0};

	Hero.preload = function(game) {
		game.load.spritesheet('hero-flying', 'assets/images/hero-flying.png', 46, 46);
		game.load.spritesheet('hero-ground', 'assets/images/hero-ground.png', 23, 46);
	};

	Hero.prototype.update = function(game) {
		var sprite = this.sprite;

		if(this.dashing) {
			if(game.physics.arcade.distanceToXY(sprite, this.dashTarget.x, this.dashTarget.y) < 100) {
				this.dashing = false;
			} else {
				game.physics.arcade.moveToXY(this.sprite, this.dashTarget.x, this.dashTarget.y, 3000);
			}
		} else {
			if (game.input.mousePointer.isDown) {
				this.charging = true;
			} else if(this.charging) {
				this.startDash();
			} else {
				sprite.body.maxVelocity = Hero.MAX_VELOCITY;
				sprite.body.drag = Hero.DRAG;
			}

			this.userMove();
		}
	};

	Hero.prototype.startDash = function() {
		var sprite = this.sprite;

		this.charging = false;
		this.dashing = true;
		sprite.body.acceleration.set(0, 0);
		sprite.body.drag = Hero.DASH_DRAG;
		sprite.body.maxVelocity = Hero.DASH_MAX_VELOCITY;
		this.dashTarget.x = game.input.mousePointer.worldX;
		this.dashTarget.y = game.input.mousePointer.worldY;
	};

	Hero.prototype.userMove = function() {
		var sprite = this.sprite,
			controls = this.controls;

		if(controls.toggleFlight.isDown) {
			this.toggleFlight();
		}

		if (controls.up.isDown) {
			if(this.isFlying) {
				sprite.body.acceleration.y = -Hero.THRUST;
			} else if (sprite.bottom > sprite.game.physics.arcade.bounds.bottom) {
				sprite.body.velocity.x = 2000;
			}
		} else if (controls.down.isDown) {
			sprite.body.acceleration.y = Hero.THRUST;
		} else {
			sprite.body.acceleration.y = 0;
		}

		if (controls.left.isDown) {
			sprite.body.acceleration.x = -Hero.THRUST;
		} else if (controls.right.isDown) {
			sprite.body.acceleration.x = Hero.THRUST;
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