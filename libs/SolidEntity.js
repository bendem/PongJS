"use strict";

var SolidEntity = function() {
    this.solid = true;
};

var unimplementedError = function() {
    throw Error('unimplemented method');
};

extend(SolidEntity, Entity, {
    getLeftX: unimplementedError
    , getRightX: unimplementedError
    , getTopY: unimplementedError
    , getBottomY: unimplementedError
    , handleCollision: function(ball, direction) {
        unimplementedError();
    }
});
