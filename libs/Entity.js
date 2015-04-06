"use strict";

/**
 * Creates an non solid entity.
 *
 * If an anchor is provided, the entity position will
 * be computed to match the real position of the entity
 * when the object is constructed and that position will
 * be updated when the canvas size changes by the default
 * implementation of containerWidthChanged and
 * containerHeightChanged.
 *
 * @param Point  The position of the entity
 * @param Anchor The anchor position of the entity.
 */
var Entity = function(position, anchor) {
    this.relativePosition = position;
    if(anchor && anchor != Anchor.TopLeft) {
        this.position = anchor.convertPoint(position);
    } else {
        this.position = position;
    }
    this.anchor = anchor;
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
     * Default implementation will update the position of the entity according
     * to its anchor if one is provided.
     *
     * @param Number The new width
     */
    , containerWidthChanged: function(width) {
        if(this.anchor && this.anchor != Anchor.TopLeft) {
            this.position = this.anchor.convertPoint(this.relativePosition, width);
        }
    }

    /**
     * Handles a height change of the game.
     * Note: This method is called automatically when the height changes.
     *
     * Default implementation will update the position of the entity according
     * to its anchor if one is provided.
     *
     * @param Number The new height
     */
    , containerHeightChanged: function(height) {
        if(this.anchor && this.anchor != Anchor.TopLeft) {
            this.position = this.anchor.convertPoint(this.relativePosition, null, height);
        }
    }
};
