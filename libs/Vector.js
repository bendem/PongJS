/**
 * Creates a 0,0 based 2D vector.
 *
 * Note: All vector methods returns a new vector leaving the original
 * vector unchanged.
 *
 * @param Number X component of the vector
 * @param Number Y component of the vector
 */
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype = {
    /**
     * Multiply a vector by a number.
     *
     * @param  double The number to multiply the vector by
     * @return Vector The multiplied vector
     */
    multiply: function(value) {
        return new Vector(this.x * value, this.y * value);
    }

    /**
     * Computes the rotation of the vector.
     *
     * @return double the rotation of the vector between 0 and 2π
     */
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

    /**
     * Sets the absolute rotation of the vector.
     *
     * @param  double The new rotation of the vector
     * @return Vector The rotated vector
     */
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

    /**
     * Rotates the vector.
     *
     * @param  double The rotation to add to the current rotation
     * @return Vector The rotated vector
     */
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

    /**
     * Gets the length of the vector.
     *
     * @return double
     */
    , getLength: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Sets the length of the vector.
     *
     * @param  double The new length of the vector
     * @return Vector The vector with its new length
     */
    , setLength: function(length) {
        return this.normalize().multiply(length);
    }

    /**
     * Sets the length of the vector to 1 while keeping its rotation.
     *
     * @return Vector The normalized vector
     */
    , normalize: function() {
        var rotation = this.getRotation();
        return new Vector(Math.cos(rotation), Math.sin(rotation));
    }

    /**
     * Clones the vector.
     *
     * @return Vector A copy of the vector.
     */
    , clone: function() {
        return new Vector(this.x, this.y);
    }
};
