import ui.View;
import ui.ImageView;
import ui.TextView;
import src.Utils as Utils;
import device;
import ui.resource.Image as Image;
import math.geom.Point as Point;
import math.array;
import src.Block as Block;
import src.PosibleSwapData as PosibleSwapData;
import animate;
import src.Enum as Enum;
import ui.ScoreView;
import ui.SpriteView;
import AudioManager;

var status = Enum(
	'NONE',
	'PREPARE_REMOVE_CHAINS',
	'REMOVING_MATCH_CHAINS',
	'FALLING_BLOCKS',
	'FILLING_GAPS',
	'SUFFLING'
	);

exports = Class(ui.View, function (supr) {
	const MAX_CAPACITY = 8;
	const BLOCK_SIZE = 65;
	const OFFSET_Y = 180;
	const OFFSET_X = (576 - (BLOCK_SIZE*8))/2.0;
	const DEFAULT_SCORE = 60;
	const MAX_MOVES = 20;
	const DELAY_TIME = 300;
	const SCORE_MATCH_3 = 50;
	const SCORE_MATCH_4 = 100;
	const SCORE_MATCH_5 = 200;
	const DEFAULT_TIMER_MODE_VALUE = 30;
	const DEFAULT_TARGET_SCORE = 10000;
	const BLOCK_TYPE_COUNT = 6;

	var _arrayGrid;
	var _countTap;
	var _lastBlock;
	var _posibleSwaps = new Array(); //List current posible swap on grid
	var _chains = new Array(); // List current match chain
	var _isAvaiableToHandle;
	var _score;
	var _moves;
	var _startDragTile;
	var _endDragTile;
	var _scoreValue;
	var _bonusComboScore;
	var _lblScoreValue;
	var _lblChanllengeValue;
	var _lblScore;
	var _lblChanllenge;
	var _spriteTimer;
	var _lblTimer;
	this.status = status.NONE;
	this.mode = Utils.gameMode.ENDLESS_MODE;

	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			layout: "box",
		});

		supr(this, 'init', [opts]);
		this._countTap = 0;
		this._isAvaiableToHandle = true;
		this._score = 0;
		this._moves = 0;
		this._scoreValue = 0;
		this._bonusComboScore = 0;
		this.build();
		this.initGrid();

		this._lblScoreValue = new ui.ScoreView( {
			superview: this,
			x: 105,
			y: 25,
			width: 320,
			height: 50,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			characterData: Utils.characterData_Score,
			color: 'red',
			text: "0"
		});

		this._lblScore = new ui.TextView({
			superview: this,
			x: 15,
			y: 25,
			width: 320,
			height: 50,
			autoSize: false,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: false,
			color: 'orange',
			text: 'Score:'
		});
	};

	this.playGame = function() {
		this._scoreValue = 0;
		this._lblScoreValue.setText('0');
		this.suffle();
	}

	this.suffle = function() {
		this.loadMap(this.generateMap());
	}

	this.initGrid = function() {
		var size  = MAX_CAPACITY;
		_arrayGrid = new Array(size);
		for(var i = 0;i< size;i++) {
			_arrayGrid[i] = new Array(size);
			for(var j=0;j<size;j++) {
				var _x = j*BLOCK_SIZE + OFFSET_X;
				var _y = 1024 - ((MAX_CAPACITY - i)*BLOCK_SIZE + OFFSET_Y);
				var image = new Block( {
					superview: this,
					x: _x,
					y: _y,
					anchorX: BLOCK_SIZE/2,
					anchorY: BLOCK_SIZE/2,
					width: BLOCK_SIZE,
					height: BLOCK_SIZE
				});
				image.setTile(new Point(i,j));
				image.on('InputSelect', bind(this, function (event, point) {
					this.processSwap(event.target);
				}));

				_arrayGrid[i][j] = image;
			}
		}
	};

	this.generateMap = function() {
		var size = MAX_CAPACITY;
		var array =  new Array(size);
		for(var i = 0;i< size;i++) {
			array[i] = new Array(size);
			for(var j=0;j<size;j++) {
				var id = Utils.randInt(0, BLOCK_TYPE_COUNT -1);
				while((j >= 2 && array[i][j-1] == id && array[i][j-2] == id) 
					|| (i>=2 && array[i-1][j] == id && array[i - 2][j] == id)) {
					id = Utils.randInt(0, BLOCK_TYPE_COUNT -1);
			}
			array[i][j] = id;
		}
	}
	return array;
};

this.loadMap = function(arr) {
	var size  = MAX_CAPACITY;
	for(var i = 0;i< size;i++) {
		for(var j=0;j<size;j++) {
			var curGem = arr[i][j];
			var image = new Image({url: "resources/images/icon_block_" + curGem + ".png"});
			_arrayGrid[i][j].setType(curGem);
			_arrayGrid[i][j].setImage(image);
		}
	}
	this.detectPosibleSwaps();
};

this.resetGame = function() {
	this.status = status.SUFFLING;
	for(var i = 0;i< MAX_CAPACITY;i++) {
		for(var j=0;j<MAX_CAPACITY;j++) {
			_arrayGrid[i][j].setRemove(false);
			animate(_arrayGrid[i][j], 'myGroup').now({scale: 1, x: j*BLOCK_SIZE + OFFSET_X, y: 1024 - ((MAX_CAPACITY - i)*BLOCK_SIZE + OFFSET_Y)});
		}
	}
}

this.refreshTouch = function() {
	for(var i = 0;i< MAX_CAPACITY;i++) {
		for(var j=0;j<MAX_CAPACITY;j++) {
			var block = _arrayGrid[i][j];
		}
	}
}

this.onSwipe = function(angle, dir, numberOfFingers) {
	//alert("U Swipe with dir " + dir);
}

this.isAvaiableToSwap = function(pt1, pt2) {
	if(pt1.x < 0 || pt1.y < 0 || pt2.x < 0 || pt2.y < 0 || (pt1.x == pt2.x && pt1.y == pt2.y)) {
		return false;
	}

	if(pt1.x == pt2.x) {
		return Math.abs(pt1.y - pt2.y) == 1;
	}

	if(pt1.y == pt2.y) {
		return Math.abs(pt1.x - pt2.x) == 1;
	}

};

this.processSwap = function(block) {
	if(this._isAvaiableToHandle == true) {
		this._countTap++;
		if(this._countTap >=2 ) {
			this._countTap = 0;		
			var lastPos = new Point(this._lastBlock.getPos().x, this._lastBlock.getPos().y);
			var curPos = new Point(block.getPos().x, block.getPos().y);
			if(this._lastBlock != null 
				&& this.isAvaiableToSwap(block.getTile(), this._lastBlock.getTile())) {
				if(this.isPosibleSwap(block.getTile(), this._lastBlock.getTile())) {
					this._isAvaiableToHandle = false;
					this.status = status.REMOVING_MATCH_CHAINS;
					var curTile = new Point(block.getTile().x, block.getTile().y);
					var lastTile = new Point(this._lastBlock.getTile().x, this._lastBlock.getTile().y);
					block.setTile(lastTile);				
					this._lastBlock.setTile(curTile);	
					this.swapElement(curTile, lastTile);			
					animate(block, 'myGroup').now({x:lastPos.x, y: lastPos.y, scale: 1});
					animate(this._lastBlock, 'myGroup').now({x:curPos.x, y: curPos.y, scale:1});
				} else {				
					animate(block, 'myGroup').now({x:lastPos.x, y: lastPos.y, scale: 1}).then({x: curPos.x, y: curPos.y});
					animate(this._lastBlock, 'myGroup').now({x:curPos.x, y: curPos.y, scale:1}).then({x: lastPos.x, y: lastPos.y});
				}
				this._lastBlock = null;
			} else {				
				if(this._lastBlock != block) {
					animate(this._lastBlock, 'myGroup').now({scale:1});
					scaleAnimation.call(block);
				}
				this._countTap = 1;
				this._lastBlock = block;
			}
		} else {
			if(this._lastBlock != block) {
				scaleAnimation.call(block);
			}
			this._lastBlock = block;
		}
	}
};

this.processSwapWithDrag = function() {
	if(this._isAvaiableToHandle == false ||
		(this._startDragTile.x == this._endDragTile.x && this._startDragTile.y == this._endDragTile.y))
	{
		return;
	}
	var beginTile = new Point(this._startDragTile, this._startDragTile.y);
	var endTile = new Point(this._endDragTile.x, this._endDragTile.y);
	if(Math.abs(endTile.x - beginTile.x) > Math.abs(endTile.y - beginTile.y)) {
		endTile.y = beginTile.y;
		if(endTile.x > beginTile.x) {
			endTile.x = beginTile.x + 1;
		} else {
			endTile.x = beginTile.x - 1;
		}
	} else {
		endTile.x = beginTile.x;
		if(endTile.y > beginTile.y) {
			endTile.y = beginTile.y + 1;
		} else {
			endTile.y = beginTile.y - 1;
		}
	}

	var blockBegin = _arrayGrid[beginTile.x][beginTile.y];
	var blockEnd = _arrayGrid[endTile.x][endTile.y];
	var beginPos = new Point(blockBegin.getPos().x, blockBegin.getPos().y);
	var endPos = new Point(blockEnd.getPos().x, blockEnd.getPos().y);
	if(this.isPosibleSwap(blockBegin.getTile(), blockEnd.getTile())) {
		this.status = status.PREPARE_REMOVE_CHAINS;
		blockBegin.setTile(endTile);				
		blockEnd.setTile(beginTile);		
		this.swapElement(beginTile, endTile);			
		animate(blockBegin, 'myGroup').now({x:endPos.x, y: endPos.y, scale: 1});
		animate(blockEnd, 'myGroup').now({x:beginPos.x, y: beginPos.y, scale:1});
	} else {				
		animate(blockBegin, 'myGroup').now({x:endPos.x, y: endPos.y, scale: 1}).then({x: beginPos.x, y: beginPos.y});
		animate(blockEnd, 'myGroup').now({x:beginPos.x, y: beginPos.y, scale:1}).then({x: lastPos.x, y: lastPos.y});
	}
};

//Check a block can make a chain or not.
this.isAPartOfChain = function(tile) {
	var block = _arrayGrid[tile.x][tile.y];
	var type = block.getType();
	var horizontalCount = 1;

	for(var i=tile.y - 1; i>=0 && _arrayGrid[tile.x][i].getType() == type;i--) {
		horizontalCount++;
	}

	for(var i=tile.y + 1; i<MAX_CAPACITY && _arrayGrid[tile.x][i].getType() == type;i++) {
		horizontalCount++;
	}

	if(horizontalCount >=3) {
		return true;
	}

	var verticalCount = 1;

	for(var i = tile.x - 1;i>=0 && _arrayGrid[i][tile.y].getType() == type;i--) {
		verticalCount++;
	}

	for(var i = tile.x + 1;i< MAX_CAPACITY && _arrayGrid[i][tile.y].getType() == type;i++) {
		verticalCount++;
	}

	if(verticalCount >= 3) {
		return true;
	}

	return false;
}

//this function detect posible swap (user can swap an got matches-tree chain)
this.detectPosibleSwaps = function() {
	this.clearArray(_posibleSwaps);
	for(var i = 0; i < MAX_CAPACITY; i++) {
		for(var j = 0; j< MAX_CAPACITY; j++) {
			var block = _arrayGrid[i][j];

		//horizontal
		if(j < MAX_CAPACITY - 1) {
			var otherBlock = _arrayGrid[i][j+1];
			//Swap
			this.swapElement(block.getTile(), otherBlock.getTile());
			if((this.isAPartOfChain(block.getTile()) ||
				this.isAPartOfChain(otherBlock.getTile())) &&
				block.getTile() != otherBlock.getTile()) {
				var data = new PosibleSwapData();
			data.setTileA(block.getTile());
			data.setTileB(otherBlock.getTile());
			_posibleSwaps.push(data);
		}
			//swap back				
			this.swapElement(block.getTile(), otherBlock.getTile());
		}

		//vertical
		if(i < MAX_CAPACITY - 1) {
			var otherBlock = _arrayGrid[i + 1][j];
			//Swap
			this.swapElement(block.getTile(), otherBlock.getTile());
			if((this.isAPartOfChain(block.getTile()) ||
				this.isAPartOfChain(otherBlock.getTile())) &&
				block.getTile() != otherBlock.getTile()) {
				var data = new PosibleSwapData();
			data.setTileA(block.getTile());
			data.setTileB(otherBlock.getTile());
			_posibleSwaps.push(data);
		}
			//swap back
			this.swapElement(block.getTile(), otherBlock.getTile());
		}
	}
}
}

//Check two block is posible to swap or not
this.isPosibleSwap = function(tileA, tileB) {
	for(var i=0;i<_posibleSwaps.length;i++) {
		var data = _posibleSwaps[i];
		if((data.getTileA().x == tileA.x && data.getTileA().y == tileA.y && data.getTileB().x == tileB.x && data.getTileB().y == tileB.y)||
			(data.getTileA().x == tileB.x && data.getTileA().y == tileB.y && data.getTileB().x == tileA.x && data.getTileB().y == tileA.y)) {
			return true;
	}
}
return false;
}

//this function detect list of chain (chain of block is make match-tree or more)
this.detectMatchChains = function() {
	this.clearArray(_chains);
	var chains_H = new Array();
	var chains_V = new Array();
	for(var r = 0;r<MAX_CAPACITY;r++) {
		for(var c = 0; c < MAX_CAPACITY; c++) {
			var tile = new Point(r, c);
			var block = _arrayGrid[r][c];
			var type = block.getType();
			var horizontalCount = 1;
			var chainH = new Array();
			chainH.push(tile);
			for(var i=tile.y - 1; i>=0 && _arrayGrid[tile.x][i].getType() == type && _arrayGrid[tile.x][i].isRemove() == 0;i--) {
				horizontalCount++;
				chainH.push(new Point(tile.x, i));
			}

			for(var i=tile.y + 1; i<MAX_CAPACITY && _arrayGrid[tile.x][i].getType() == type && _arrayGrid[tile.x][i].isRemove() == 0;i++) {
				horizontalCount++;
				chainH.push(new Point(tile.x, i));
			}

			if(horizontalCount >=3) {
			//Check exist
			var isExist = false;
			for(var x = 0;x < chains_H.length && isExist == false;x++) {
				var arrX = chains_H[x];
				for(var y = 0; y < arrX.length && isExist == false;y++) {
					for(var z = 0;z < chainH.length && isExist == false; z++) {
						var tileX = arrX[y];
						var tileZ = chainH[z];
						if(tileX.x == tileZ.x && tileX.y == tileZ.y) {
							isExist = true;
						}
					}
				}
			}
			if(isExist == false) {
				chains_H.push(chainH);
			}
		} else {
			this.clearArray(chainH);
		}

		var verticalCount = 1;
		var chainV = new Array();
		chainV.push(tile);
		for(var i = tile.x - 1;i>=0 && _arrayGrid[i][tile.y].getType() == type && _arrayGrid[i][tile.y].isRemove() == 0;i--) {
			verticalCount++;
			chainV.push(new Point(i, tile.y));
		}

		for(var i = tile.x + 1;i< MAX_CAPACITY && _arrayGrid[i][tile.y].getType() == type && _arrayGrid[i][tile.y].isRemove() == 0;i++) {
			verticalCount++;				
			chainV.push(new Point(i, tile.y));
		}

		if(verticalCount >= 3) {
			//Check exist
			var isExist = false;
			for(var x = 0;x < chains_V.length && isExist == false;x++) {
				var arrX = chains_V[x];
				for(var y = 0; y < arrX.length && isExist == false;y++) {
					for(var z = 0;z < chainV.length && isExist == false; z++) {
						var tileX = arrX[y];
						var tileZ = chainV[z];
						if(tileX.x == tileZ.x && tileX.y == tileZ.y) {
							isExist = true;
						}
					}
				}
			}
			if(isExist == false) {
				chains_V.push(chainV);
			}
		} else {
			this.clearArray(chainV);
		}
	}
}

for(var i = 0; i<chains_H.length;i++) {
	_chains.push(chains_H[i]);
}
for(var i = 0; i<chains_V.length;i++) {
	_chains.push(chains_V[i]);
}
}
// this function will remove all match chains in game
function removeMatchChains() {
	this.status = status.REMOVING_MATCH_CHAINS;
	this._isAvaiableToHandle = false;
	this.detectMatchChains();
	for(var i=0;i<_chains.length;i++) {
		var chain = _chains[i];
	//run Anim Score 
	_bonusComboScore++;
	this.processScore(chain.length, chain[0].x, chain[0].y);
	for(var j = 0; j < chain.length;j++) {
		var tile = chain[j];
		for(var k = 0; k < MAX_CAPACITY; k++) {
			for(var h = 0; h< MAX_CAPACITY;h++) {
				var block = _arrayGrid[k][h];
				if(block.getTile().x == tile.x &&
					block.getTile().y == tile.y) {
					switch(chain.length) {
						case 4: {
							var image = new Image({url: "resources/images/lightning_power_glow.png"});
							block.setImage(image);
							break;
						}
						case 5: {
							var image = new Image({url: "resources/images/colorbomb_icon.png"});
							block.setImage(image);
							break;
						}
						default:
						case 3: {
							var image = new Image({url: "resources/images/sparkly_"+ block.getType() + ".png"});
							block.setImage(image);
							break;
						}
					}
					animate(block, 'myGroup').now({scale: 0});
					block.setRemove(1);
				}
			}
		}
	}
}
this.clearArray(_chains);
}

//this function will fall block from top to bottom (if grid has gaps)
function fallBlocks() {
	this.status = status.FALLING_BLOCKS;
	for(var i=0;i<MAX_CAPACITY;i++) {
		for(var j=0;j<MAX_CAPACITY;j++){
			var block = _arrayGrid[i][j];
			var scale = block.style.scale;
			var type = block.getType();
			if(block.isRemove() == 1) {
				var _fallBlocks = new Array();
				for(var lookup = i-1;lookup >=0 ; lookup--) {
					var block2 = _arrayGrid[lookup][j];
					var tile1 = new Point(block.getTile().x, block.getTile().y);
					var tile2 = new Point(block2.getTile().x, block2.getTile().y);
					block.setTile(tile2);
					block2.setTile(tile1);
					this.swapElement(tile1, tile2);
					_fallBlocks.push(block2);
				}
				for(var order = 0; order < _fallBlocks.length; order ++) {
					var nowPos = new Point(block.getPos().x, block.getPos().y -BLOCK_SIZE*order);
					var fallBlock = _fallBlocks[order];
					var delay = 50 + 50*order;
					var duration = 50*Math.abs(block.getPos().y - fallBlock.getPos().y)/BLOCK_SIZE;
					animate(fallBlock, 'myGroup').now({x: nowPos.x, y: nowPos.y}, duration + delay);
				}
				this.clearArray(_fallBlocks);
			}
		}
	}
}

function fillGaps() {
	this.status = status.FILLING_GAPS;
	var isCallRecheck = false;
	var lastType = -1;
	for(var j =0;j<MAX_CAPACITY;j++) {
		var _fallBlocks = new Array();
		for(var i = MAX_CAPACITY -1;i>=0;i--) {
			var block = _arrayGrid[i][j];
			if(block.isRemove() == 1) {		
				var newType = Utils.randInt(0, BLOCK_TYPE_COUNT -1);
				while(lastType == newType) {
					newType = Utils.randInt(0, BLOCK_TYPE_COUNT-1);
				}
				lastType = newType;
				var image = new Image({url: "resources/images/icon_block_" + newType + ".png"});
				block.setType(newType);
				animate(block, 'myGroup').now({y:1024 - (MAX_CAPACITY*BLOCK_SIZE +OFFSET_Y)}, 0).then({scale: 1});
				block.setRemove(false);
				block.setImage(image);
				_fallBlocks.push(block);
			}
		}

		var startIndex = 0;
		var startPos = new Point(0, 0);
		if(_fallBlocks.length > 0) {
			startIndex = _fallBlocks[0].getTile().x;
			startPos.x = _fallBlocks[0].getTile().y*BLOCK_SIZE + OFFSET_X;
			startPos.y = 1024 - ((MAX_CAPACITY - startIndex)*BLOCK_SIZE + OFFSET_Y);
		}
		for(var order = 0; order<_fallBlocks.length;order++) {
			var fallBlock = _fallBlocks[order];
			var delay = 50 + 50 *order;
			var duration = 50*startIndex;
			animate(fallBlock, 'myGroup').then({x: startPos.x, y: startPos.y - BLOCK_SIZE*order}, delay + duration);
		}
		this.clearArray(_fallBlocks);
	}
}

function checkAfterFillGaps() {
	this._isAvaiableToHandle = true;
	this.detectPosibleSwaps();
	this.detectMatchChains();
	if(_chains.length > 0) {
		removeMatchChains.call(this);
	}
}

this.swapElement = function(tileA, tileB) {
	var temp = _arrayGrid[tileA.x][tileA.y];
	_arrayGrid[tileA.x][tileA.y] = _arrayGrid[tileB.x][tileB.y];
	_arrayGrid[tileB.x][tileB.y] = temp;
}

this.clearArray = function(arr) {
	while(arr.length > 0) {
		arr.pop();
	}
	arr.length = 0;
}

function scaleAnimation() {
	animate(this, 'myGroup').clear().now({scale:1.2}).then({scale:1}).then(scaleAnimation.bind(this));
}

this.processScore = function(value, _x, _y)
{
	var newValue;
	switch(value) {
		case 3: {
			newValue = SCORE_MATCH_3;
			this.sound.play('score_1');
			break;
		}
		case 4: {			
			newValue = SCORE_MATCH_4;
			this.sound.play('score_2');
			break;
		}
		case 5: {			
			newValue = SCORE_MATCH_5;
			this.sound.play('score_3');
			break;
		}
	}
	
	var block = _arrayGrid[_x][_y];
	var pos = new Point(block.getPos().x, block.getPos().y);
	var curScore = new ui.ScoreView({
		superview: this,
		x: pos.x,
		y: pos.y,
		width: 320,
		height: 50,
		horizontalAlign: 'center',
		characterData: Utils.characterData_Score,
		text: newValue
	});
	animate(curScore).now({y: pos.y - 50, opacity:0}).then(bind(curScore, function(){
		this.removeFromSuperview();
	}));

	var bonusValue = 0;
	if(_bonusComboScore >= 3) {
		bonusValue = newValue*_bonusComboScore;
		var bonusScore = new ui.TextView({
			superview: this,
			x: pos.x,
			y: pos.y,
			width: 300,
			height: 40,
			horizontalAlign: 'right',
			color: 'red',
			text: '+' + bonusValue
		});
		animate(bonusScore).now({y: pos.y - 50, opacity:0}).then(bind(bonusScore, function(){
			this.removeFromSuperview();
		}));
	}
	this._scoreValue+=newValue + bonusValue;	
	this._lblScoreValue.setText(this._scoreValue);
}
this.tick = function(dt) {
	var animationGroup = animate.getGroup('myGroup');
	if(animationGroup != null &&
		animationGroup.isActive() == false) {
		switch(this.status) {
			case status.NONE: {
				break;
			}
			case status.PREPARE_REMOVE_CHAINS: {
				removeMatchChains.call(this);
				break;
			}
			case status.SUFFLING: {
				this._isAvaiableToHandle = true;
				this.detectPosibleSwaps();
				this.detectMatchChains();
				if(_chains.length > 0) {
					removeMatchChains.call(this);
				} else {
					this._isAvaiableToHandle = true;
					this.status = status.NONE;
					_bonusComboScore = 0;
					this.refreshTouch();
				}
				break;
			}
			case status.REMOVING_MATCH_CHAINS: {
				fallBlocks.call(this);
				break;
			}
			case status.FALLING_BLOCKS: {
				this.detectPosibleSwaps();
				this.detectMatchChains();
				if(_chains.length > 0) {
					removeMatchChains.call(this);
				} else {
					fillGaps.call(this);
				}
				break;
			}
			case status.FILLING_GAPS: {
				this.detectPosibleSwaps();
				this.detectMatchChains();
				if(_chains.length > 0) {
					removeMatchChains.call(this);
				} else {
					this._isAvaiableToHandle = true;
					this.status = status.NONE;
					_bonusComboScore = 0;
					this.refreshTouch();
				}
				break;
			}
		}
	}

//check GameOver
if(_posibleSwaps.length == 0) {
	this.resetGame();
	this.suffle();
}
}

this.loadSound = function () {
	this.sound = new AudioManager({
		path: "resources/sounds/",
		files: {
			background: { path: 'music', volume: 1, background: true }
		}
	});
}


this.build = function() {		
	var _background = new ui.ImageView( {
		superview: this,
		x:0,
		y:0,
		layout:'box',
		image: "resources/images/bkgd_table.png"
	});

	this.style.width = _background.style.width;
	this.style.height = _background.style.height;

	var headerScoreBG = new ui.ImageView( {
		superview: this,
		x:0,
		y:0,
		width:270,
		height:90,
		image: "resources/images/header_score_small.png"
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
		this.emit('gamescene:end');
	}));

	this.sound = new AudioManager({
		path: "resources/sounds/",
		files: {
			score_1: { volume: 1, path: 'effects' },
			score_2: { volume: 1, path: 'effects' },
			score_3: { volume: 1, path: 'effects' }
		}
	});
};
});
