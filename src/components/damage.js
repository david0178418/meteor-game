define(function(require) {
	"use strict";
	return function(hitPoints) {
		return {
			hitPoints: hitPoints,
			newDamage: false,
			damage: function(points) {
				this.hitPoints -= points;
				this.newDamage = true;
			}
		};
	};
});