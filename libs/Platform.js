"use strict";

// position: Point containing the top left corner position
var Platform = function(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;
};

Platform.prototype = extend(new Entity(), {
    getLeftX: function() {
        return this.position.x;
    }
    , getRightX: function() {
        return this.position.x + this.width;
    }
    , getTopY: function() {
        return this.position.y;
    }
    , getBottomY: function() {
        return this.position.y + this.height;
    }
    , setLeftX: function(x) {
        this.position.x = x;
        return this;
    }
    , setRightX: function(x) {
        this.position.x = x - this.width;
        return this;
    }
    , setTopY: function(y) {
        this.position.y = y;
        return this;
    }
    , setBottomY: function(y) {
        this.position.y = y - this.height;
        return this;
    }

    , move: function(to) { // to => center of the plateform
        if(to + this.width / 2 > w) {
            this.setRightX(w);
        } else if(to - this.width / 2 < 0) {
            this.setLeftX(0);
        } else {
            this.position.x = to - this.width/2;
        }
    }

    , draw: function(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.fillStyle = '#999';
        ctx.fill();
    }

    , containerWidthChanged: function(width) {
        if(this.getRightX() > width) {
            this.setRightX(width);
        }
    }
    , containerHeightChanged: function(height) {
        this.setBottomY(height - 5);
    }
});
