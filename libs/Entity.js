"use strict";

var Entity = function() {};

Entity.prototype = {
    getBoundingBox: function() {
        /**
         *
         */
        if(this.hasOwnProperty('getLeftX')
                && this.hasOwnProperty('getRightX')
                && this.hasOwnProperty('getTopY')
                && this.hasOwnProperty('getBottomY')) {
            return this;
        }
        throw new Exception('Should override');
    }
    , draw: function() {}
    , update: function() {}
    , containerWidthChanged: function() {}
    , containerHeightChanged: function() {}
};
