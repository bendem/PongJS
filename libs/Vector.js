"use strict";

// Vector is immutable
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype = {
    multiply: function(v) {
        return new Vector(this.x * v, this.y * v);
    }

    , getRotation: function() {
        var res = Math.atan(this.y / this.x);
        if(this.x >= 0 && this.y >= 0) { // 1
            return res;
        }
        if(this.x >= 0 && this.y <= 0) { // 4
            return res + 2 * Math.PI;
        }
        if(this.x < 0 && this.y >= 0) { // 2
            return res + Math.PI;
        }
        if(this.x < 0 && this.y < 0) { // 3
            return res + Math.PI;
        }
    }

    , setRotation: function(rotation) {
        rotation %= 2 * Math.PI;
        if(rotation < 0) {
            rotation += 2 * Math.PI;
        }
        var current = this.getRotation();

        if(rotation === current) {
            return this.clone();
        }

        return this.rotate(rotation - current);
    }

    , rotate: function(rotation) {
        if(rotation % (2 * Math.PI) === 0) {
            return this.clone();
        }

        var cos = Math.cos(rotation);
        var sin = Math.sin(rotation);

        var x = cos * this.x + (-sin * this.y);
        var y = sin * this.x + cos * this.y;

        return new Vector(x, y);
    }

    , getLength: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    , setLength: function(length) {
        return this.normalize().multiply(length);
    }

    , normalize: function() {
        var rotation = this.getRotation();
        return new Vector(Math.cos(rotation), Math.sin(rotation));
    }

    , clone: function() {
        return new Vector(this.x, this.y);
    }
};
