requirejs.config({
	//urlArgs: "bust=" +  (new Date()).getTime(),	//cache-bust if needed
	baseUrl: 'src',
	paths: {
		Phaser: '../libs/phaser-official/build/phaser'
	},
	map: {
		'*': {
			phaser: 'Phaser'
		}
	}
});

require(['app'],
	function(App) {
		var app = new App('#app');
	}
);
