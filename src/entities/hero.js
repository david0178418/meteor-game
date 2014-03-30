define(function(require) {
	"use strict";

	var Phaser = require('phaser');

	function Hero(game) {
		this.thrust = 0;
		this.powerStep = 0;
		this.registerStep = true;
		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            powerUp: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            powerDown: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			maxPower: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};

		this.sprite = game.add.sprite(100, 100, 'hero-ground');
		this.sprite.animations.add('walk');
		this.sprite.loadTexture('hero-flying', 0);
		this.sprite.animations.add('fly');
		this.sprite.animations.play('walk', 20, true);
		this.sprite.anchor.setTo(0.5, 0.5);

		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.allowRotation = false;
		this.sprite.body.collideWorldBounds=true;
		this.sprite.body.gravity.y = 1500;
		this.sprite.body.allowGravity = true;
		this.sprite.body.maxVelocity = new Phaser.Point(0, 0);
	}

	Hero.THRUST_INCREMENT = 500;
	Hero.MAX_INCREMENT = 50;
	Hero.DRAG = new Phaser.Point(900, 900);

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
		if (this.registerStep) {
			if(this.controls.powerUp.isDown) {
				this.registerStep = false;
				this.powerStep++;

				if(this.powerStep === 1) {
					this.toggleFlight();
				}

				this.powerStep++;
				this.thrust = this.powerStep * Hero.THRUST_INCREMENT;
				this.sprite.body.maxVelocity.x = this.powerStep * Hero.MAX_INCREMENT;
				this.sprite.body.maxVelocity.y = this.powerStep * Hero.MAX_INCREMENT;

				console.log('A: ', this.thrust, '/ V: ', this.sprite.body.maxVelocity.x);
			} else if(this.controls.powerDown.isDown && this.powerStep > 0) {
				this.registerStep = false;
				this.powerStep--;
				this.thrust = this.powerStep * Hero.THRUST_INCREMENT;
				this.sprite.body.maxVelocity.x = this.powerStep * Hero.MAX_INCREMENT;
				this.sprite.body.maxVelocity.y = this.powerStep * Hero.MAX_INCREMENT;

				if(!this.powerStep) {
					this.toggleFlight();
				}

				console.log('A: ', this.thrust, '/ V: ', this.sprite.body.maxVelocity.x);
			}
		}

		if(!this.registerStep && !(this.controls.powerUp.isDown || this.controls.powerDown.isDown)) {
			this.registerStep = true;
		}
	};

	Hero.prototype.userMove = function() {
		var sprite = this.sprite,
			controls = this.controls;

		if (controls.up.isDown) {
			sprite.body.acceleration.y = -this.thrust;
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
		var animation = this.powerStep ? 'fly':'walk';
		this.sprite.play(animation, 20, true);
		this.sprite.body.allowGravity = !this.powerStep;
		console.log(this.powerStep, animation)
	};



	return Hero;
});