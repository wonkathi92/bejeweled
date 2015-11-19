import device;
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.SpriteView;
import src.Utils as Utils;

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

		var instruction = new ui.TextView({
			superview: this,
			layout:'box',
			x: 30,
			y: 50,
			autoSize: false,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: true,
			color: 'orange',
			text: Utils.instruction
		});

		var backToMenu = new ui.ImageView( {
			superview: this,
			x:450,
			y:0,
			width:90,
			height:90,
			image: "resources/images/btn_back.png"
		});

		backToMenu.on('InputSelect', bind(this, function () {
			this.emit('instruction:end');
		}));
	};
});
