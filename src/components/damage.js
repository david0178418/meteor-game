define(function(require) {
	"use strict";
	return function(hitPoints) {
		return {
			hitPoints: hitPoints,
			isDead: function() {
				return this.hitPoints <= 0;
			},
			damage: function(points) {
				this.hitPoints -= points;
				return this.hitPoints;
			}
		};
	};
});