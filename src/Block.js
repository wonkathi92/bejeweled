
import ui.ImageView;
import ui.SpriteView;
import animate;
import math.geom.Point as Point;

exports = Class(ui.ImageView, function (supr) {
	var _tile;
	var _pos;
	var _type;
	var _isRemove;
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});
		supr(this, 'init', [opts]);
		this._isRemove = 0;
		this.build();
	};

	this.setTile = function(pt) {
		if(this._tile == null) {
			this._tile = new Point(pt.x, pt.y);
		}
		this._tile.x = pt.x;
		this._tile.y = pt.y;
	};

	this.getTile = function() {
		return this._tile;
	};

	// this.setPos = function(pt) {
	// 	if(this._pos == null) {
	// 		this._pos = new Point(pt.x, pt.y);
	// 	}
	// 	this._pos.x = pt.x;
	// 	this._pos.y = pt.y;
	// };

	this.getPos = function() {
		if(this._pos == null) {
			this._pos = new Point(this.style.x, this.style.y);
			return this._pos;
		}
		this._pos.x = this.style.x;
		this._pos.y = this.style.y;
		return this._pos;
	}

	this.setType = function(type) {
		this._type = type;
	}

	this.getType = function() {
		return this._type;
	}

	this.setRemove = function(remove) {
		this._isRemove = remove;
	}

	this.isRemove = function() {
		return this._isRemove;
	}

	this.build = function() {
	};
});
