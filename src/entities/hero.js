define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Aura = require('entities/aura'),
		damageComponent = require('components/damage');
	
	function Hero(game) {
		Phaser.Sprite.call(this, game, 100, 300, 'hero-ground');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 16;
		this.height = 16;
		// END
		this.anchor.setTo(0.5, 0.5);
		
		this.aura = new Aura(game);
		
		this.addChild(this.aura);
		
		game.add.existing(this.aura);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.allowRotation = false;
		this.body.collideWorldBounds = true;
		this.body.allowGravity = false;
		
		this.body.drag = new Phaser.Point(Hero.DRAG, Hero.DRAG);
		
		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			toggle: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
			dash: game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
		};
		
		this.poweredUp = true;
		this.stunned = false;
		
		//easy accessors
		this.drag = this.body.drag;
		this.velocity = this.body.velocity;
		this.acceleration = this.body.acceleration;
		
		this.game.add.existing(this);
		window.x = this;
	}
	
	Hero.HIT_POINTS = 10;
	Hero.MAX_VELOCITY = 200;
	Hero.MAX_DASH_VELOCITY = 300;
	Hero.DRAG = 300;
	Hero.THRUST = 3000;
	Hero.DASH_VELOCITY = 300;
	Hero.STUN_TIME = 700;

	Hero.preload = function(game) {
		Aura.preload(game);
	};
	
	Hero.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Hero.prototype, damageComponent(Hero.HIT_POINTS), {
		constructor: Hero,
		update: function(game) {
			if(this.controls.dash.isDown) {
				this.poweredUp = true;
				this.stunned = false;
			} else {
				this.poweredUp = false;
				if(this.stunned) {
					this.stunned = this.game.time.now < this.stunnedTime + Hero.STUN_TIME;
				}
			}
			
			if(!this.stunned) {
				this.userFly();
				this.aura.flareUp(this.x, this.y);
			}
		},
		userDash: function() {
			var velocity = this.velocity,
				controls = this.controls,
				dashVelocity = Hero.DASH_VELOCITY,
				maxVelocity =  this.poweredUp ? Hero.MAX_DASH_VELOCITY : Hero.MAX_VELOCITY,
				vx = 0,
				vy = 0;
			
			this.acceleration.x = 0;
			this.acceleration.y = 0;
			
			this.body.allowGravity = false;
			
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
				this.body.drag.x = this.body.drag.y = Hero.DRAG;//0;
			} else {
				this.body.drag.x = this.body.drag.y = Hero.DRAG;
			}
		},
		userFly: function() {
			var velocity = this.velocity,
				acceleration = this.acceleration,
				controls = this.controls,
				thrust = Hero.THRUST,
				maxVelocity = this.controls.dash.isDown ? Hero.MAX_DASH_VELOCITY : Hero.MAX_VELOCITY;
			
			if(!this.stunned) {
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
		stun: function() {
			this.stunned = true;
			this.stunnedTime = this.game.time.now;
			this.acceleration.x = this.acceleration.y = 0;
			this.velocity.x = this.velocity.y = 0;
		}
	});
	
	return Hero;
});