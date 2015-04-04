"use strict";

/**
 * Creates an non solid entity.
 *
 * @param Point The position of the entity
 */
var Entity = function(position) {
    this.position = position;
    this.solid = false;
};

/**
 * By default, all methods are empty, override the ones you need.
 */
Entity.prototype = {
    /**
     * Draws the entity on a canvas context.
     * Note: This method is called every frame automatically.
     *
     * @param CanvasRenderingContext2D The context to work on
     */
    draw: emptyFunction

    /**
     * Updates the entity.
     * Note: This method is called every frame automatically.
     *
     * @param Number The time at which the frame started
     * @param Array  An array containing all objects handled by the game
     */
    , update: emptyFunction

    /**
     * Handles a width change of the game.
     * Note: This method is called automatically when the width changes.
     *
     * @param Number The new width
     */
    , containerWidthChanged: emptyFunction

    /**
     * Handles a height change of the game.
     * Note: This method is called automatically when the height changes.
     *
     * @param Number The new height
     */
    , containerHeightChanged: emptyFunction
};
