

var Packer = function(direction,w,h){
	this.init(direction,w,h);
};

Packer.HORIZONTAL = 'horizontal';

Packer.VERTICAL = 'vertical';

Packer.prototype = {

	init: function(direction,w,h){
		if (direction != Packer.HORIZONTAL && direction != Packer.VERTICAL) {
			throw new Error('Invalid direction provided, "'+direction+'"');
		}
		this.direction = direction;
		this.maxWidth = w || 9999999;
		this.maxHeight = h || 9999999;
	},

	fit: function(blocks){
		switch (this.direction) {
			case Packer.HORIZONTAL: this.fitHorizontal(blocks); break;
			case Packer.VERTICAL: this.fitVertical(blocks); break;
		}
	},

	fitHorizontal: function(blocks){
		var self = this;
		this.width = 0;
		this.height = 0;
		var x = 0;
		var y = 0;
		var maxWidth = 0;
		var maxHeight = 0;
		var lastItem  
		blocks.forEach(function (item) {
			if (x + item.w > self.maxWidth) {
				maxWidth = Math.max(maxWidth, x);
				x = 0;
				y += maxHeight;
				maxHeight = 0;
			}
			if (y + item.h < self.maxHeight) {
				maxHeight = Math.max(maxHeight, item.h);
				item.fit = { x:x, y:y, w:item.w, h:item.h };
				x += item.w;
			}
		});
		this.width = maxWidth;
		this.height = y + maxHeight;
	},

	fitVertical: function(blocks){
		var self = this;
		this.width = 0;
		this.height = 0;
		var x = 0;
		var y = 0;
		var maxWidth = 0;
		var maxHeight = 0;
		var lastItem  
		blocks.forEach(function (item) {
			if (y + item.h > self.maxHeight) {
				maxHeight = Math.max(maxHeight, y)
				y = 0;
				x += maxWidth;
				maxWidth = 0;
			}
			if (x + item.w < self.maxWidth) {
				maxWidth = Math.max(maxWidth, item.w);
				item.fit = { x:x, y:y, w:item.w, h:item.h };
				y += item.h;
			}
		});
		this.width = x + maxWidth;
		this.height = maxHeight;
	}
};

module.exports = Packer;