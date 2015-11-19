import math.geom.Point as Point;

var PosibleSwapData = exports = Class(function() {
	var _tileA;
	var _tileB;
	this.init = function(opts) {
	};

	this.setTileA = function(tile) {
		if(this._tileA == null) {
			this._tileA = new Point(tile.x, tile.y);
		}
		this._tileA.x = tile.x;
		this._tileA.y = tile.y;
	}

	this.getTileA = function() {
		return this._tileA;
	}

	this.setTileB = function(tile) {
		if(this._tileB == null) {
			this._tileB = new Point(tile.x, tile.y);
		}
		this._tileB.x = tile.x;
		this._tileB.y = tile.y;
	}

	this.getTileB = function() {
		return this._tileB;
	}
});