"use strict";

var Point = function(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype = {
    add: function(vector) {
        if(!vector instanceof Vector) {
            throw 'Invalid type';
        }
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
}
