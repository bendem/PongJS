"use strict";

var Entity = function(position) {
    this.position = position;
    this.solid = false;
};

Entity.prototype = {
    draw: emptyFunction
    , update: emptyFunction
    , containerWidthChanged: emptyFunction
    , containerHeightChanged: emptyFunction
};
