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
		/*this.aura.x = this.x;
		this.aura.y = this.y;*/
		
		game.add.existing(this.aura);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.allowRotation = false;
		this.body.collideWorldBounds = true;
		//this.body.gravity.y = 400;
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
	Hero.MAX_VELOCITY = 300;
	Hero.DRAG = 300;
	Hero.THRUST = 800;
	Hero.DASH_VELOCITY = 300;
	Hero.STUN_TIME = 700;

	Hero.preload = function(game) {
		Aura.preload(game);
	};
	
	Hero.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Hero.prototype, damageComponent(Hero.HIT_POINTS), {
		constructor: Hero,
		update: function(game) {
			if(this.stunned) {
				this.stunned = this.game.time.now < this.stunnedTime + Hero.STUN_TIME;
			}
			
			if(!this.stunned && this.poweredUp && this.controls.dash.isDown) {
				this.aura.flareUp(this.x, this.y);
				this.userDash();
			} else {
				this.userFly();
			}
			
			this.aura.gravity = -400 * ( (Hero.DASH_VELOCITY - Math.abs(this.velocity.x)) / Hero.DASH_VELOCITY);
		},
		userDash: function() {
			var velocity = this.velocity,
				controls = this.controls,
				dashVelocity = Hero.DASH_VELOCITY,
				maxVelocity = Hero.MAX_VELOCITY,
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
				this.body.drag.x = this.body.drag.y = 0;
			} else {
				this.body.drag.x = this.body.drag.y = Hero.DRAG;
			}
		},
		userFly: function() {
			var velocity = this.velocity,
				acceleration = this.acceleration,
				controls = this.controls,
				thrust = Hero.THRUST,
				maxVelocity = Hero.MAX_VELOCITY;
			
			//this.body.allowGravity = true;

			if(!this.stunned && this.poweredUp) {
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
			this.acceleration.y = 0;
			this.velocity.y = 0;
		}
	});
	
	return Hero;
});