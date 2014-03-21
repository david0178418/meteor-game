//How will I organize the pieces like this??
define(function() {
	return {
		preload: function(game) {
			game.load.spritesheet('hero', 'assets/images/hero.png', 46, 46);
		},
		create: function(game) {
			var hero = game.add.sprite(10, 10, 'hero');
			hero.animations.add('flicker');
			hero.animations.play('flicker', 20, true);
			hero.anchor.setTo(0.5, 0.5);
			game.physics.enable(hero, Phaser.Physics.ARCADE);
			hero.body.allowRotation = false;
			hero.body.drag.set(5, 5);
			
			return hero;
		}
	};
});