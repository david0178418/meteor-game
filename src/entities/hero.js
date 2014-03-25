define(function() {
	function Hero(game) {
		this.charging = false;
		this.dashing = false;
		this.dashTarget = {x:0, y:0},
		this.sprite = game.add.sprite(10, 10, 'hero');
		this.controls = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		};

		this.sprite.animations.add('flicker');
		this.sprite.animations.play('flicker', 20, true);
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.allowRotation = false;
		this.sprite.body.drag.set(900, 900);

		game.camera.follow(this.sprite);
	}

	Hero.THRUST = 1900;

	Hero.preload = function(game) {
			game.load.spritesheet('hero', 'assets/images/hero.png', 46, 46);
		};

	Hero.prototype.update = function(game) {
		var sprite = this.sprite,
			controls = this.controls;

		if(this.dashing) {
			if(game.physics.arcade.distanceToXY(sprite, this.dashTarget.x, this.dashTarget.y) < 100) {
				this.dashing = false;
			}
		} else {
			if (game.input.mousePointer.isDown) {
				this.charging = true;
			} else if(this.charging) {
				this.charging = false;
				this.dashing = true;
				sprite.body.maxVelocity.set(150000, 150000);
				this.dashTarget.x = game.input.mousePointer.worldX;
				this.dashTarget.y = game.input.mousePointer.worldY;
				game.physics.arcade.moveToXY(sprite, this.dashTarget.x, this.dashTarget.y, 2000);
			} else {
				sprite.body.maxVelocity.set(500, 500);

				if (controls.up.isDown) {
					sprite.body.acceleration.y = -Hero.THRUST;
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
			}
		}

		sprite.body.checkWorldBounds();
	}

	return Hero;
});