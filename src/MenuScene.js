import device;
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.SpriteView;
import animate;
import AudioManager;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			layout: "box"
		});

		supr(this, 'init', [opts]);
		this.build();
	};

	this.build = function() {
		var _background = new ui.ImageView( {
			superview: this,
			x:0,
			y:0,
			layout:'box',
			image: "resources/images/bkgd_table.png"
		});

		var endlessMode = new ui.TextView({
			superview: this,
			x: 130,
			y: 450,
			width: 320,
			height: 50,
			autoSize: false,
			size: 38,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#FFFFFF',
			text: 'Play Game'
		});

		endlessMode.on('InputSelect', bind(this, function () {		
			this.emit('menuscene:start-endlessMode');
		}));

		var instruction = new ui.TextView({
			superview: this,
			x: 130,
			y: 550,
			width: 320,
			height: 50,
			autoSize: false,
			size: 38,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#FFFFFF',
			text: 'Instruction'
		});

		instruction.on('InputSelect', bind(this, function () {
			this.emit('menuscene:instruction');
		}));

		var sprite = new ui.SpriteView({
			superview: this,
			x: 0,
			y: -100,
			width: 400,
			height: 500,
			url: "resources/images/mermaid/mermaid",
			defaultAnimation: "blink",
			frameRate:30,
			autoStart: true
		});
	};
});
