// Vector is immutable
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    multiply: function(v) {
        return new Vector(this.x * v, this.y * v);
    },

    getRotation: function() {
        return Math.atan(this.y / this.x);
    },

    setRotation: function(rotation) {
        var current = this.getRotation();
        if(rotation == current) {
            return this.clone();
        }

        // TODO Check that works in all cases (rotation > current & rotation < current)?
        return this.rotate(rotation - current);
    },

    rotate: function(rotation) {
        if(rotation % 2 * Math.PI == 0) {
            return this.clone();
        }

        var x = Math.cos(rotation) * this.x + (-Math.sin(rotation) * this.y);
        var y = Math.sin(rotation) * this.x + Math.cos(rotation) * this.y;

        return new Vector(x, y);
    },

    getLength: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    setLength: function(length) {
        return this.normalize().multiply(length);
    },

    normalize: function() {
        var rotation = this.getRotation();
        return new Vector(Math.cos(rotation), Math.sin(rotation));
    },

    clone: function() {
        return new Vector(this.x, this.y);
    }
}
