/**
 * Prototypal inheritance: Modifies the prototype of the child
 * object to chain the parent object and adds the provided properties
 * to the new prototype.
 *
 * @param  Function The child object
 * @param  Function The parent object
 * @param  Object   The new prototype of the child object
 */
var extend = function(clazz, parent, props) {
    clazz.prototype = Object.create(parent.prototype);
    for(var prop in props) {
        clazz.prototype[prop] = props[prop];
    }
};

/**
 * Checks wether a number is between to other numbers.
 *
 * @param  Number  The number to check
 * @param  Number  One of the bounds
 * @param  Number  The other bound
 * @return Boolean
 */
var isBetween = function(x, x1, x2) {
    var xMin = Math.min(x1, x2)
      , xMax = Math.max(x1, x2);
    return x > xMin && x < xMax;
};

/**
 * Do I need to explain random
 * @param  Number Min bound
 * @param  Number Max bound
 * @return Number The random
 */
var random = function(min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Y u read this?
 */
var emptyFunction = function() {};

/**
 * A function that will throw an error about
 * unimplemented thing.
 */
var unimplementedError = function() {
    throw Error('unimplemented method');
};

var endGameTextFactory = function(text) {
};
