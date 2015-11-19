import ui.ScoreView as ScoreView;
import ui.View;

exports = Class(ui.ScoreView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			layout: "box",
			width: 320,
			height: 50
		});

		supr(this, 'init', [opts]);
		this.build();
	};

	this.scoreCharData = function() {
		var d = {};
		for (var i = 0; i < 10; i++) {
			d[i] = {
				image: "resources/images/numbers/score_" + i + ".png"
			};
		}
		return d;
	};

	this.setScoreStyle  = function() {
		this.characterData = this.scoreCharData();
	}

	this.build = function() {
	};
});