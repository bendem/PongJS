/**
 * An entity able to provide collision informations.
 */
var SolidEntity = function() {
    this.solid = true;
};

/**
 * All unimplemented methods of SolidEntity will throw an Error!
 */
extend(SolidEntity, Entity, {
    /**
     * Gets the leftmost position of the entity.
     *
     * @return Number
     */
    getLeftX: unimplementedError

    /**
     * Gets the rightmost position of the entity.
     *
     * @return Number
     */
    , getRightX: unimplementedError

    /**
     * Gets the topmost position of the entity.
     *
     * @return Number
     */
    , getTopY: unimplementedError

    /**
     * Gets the bottommost position of the entity.
     *
     * @return Number
     */
    , getBottomY: unimplementedError

    /**
     * Function called by the ball when it hits this entity
     *
     * @param Ball      The ball which hit this entity
     * @param Direction The direction from which this entity was hit by the ball
     */
    , handleCollision: unimplementedError
});
