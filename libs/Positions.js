"use strict";

var VerticalPosition = Object.freeze({
    Top: 0,
    Middle: 1,
    Bottom: 2
});

var HorizontalPosition = Object.freeze({
    Left: 0,
    Middle: 1,
    Right: 2
});

/**
 * Represents anchor position of plan coordinates.
 *
 * @param HorizontalPosition
 * @param VerticalPosition
 */
var Position = function(hori_position, vert_position) {
    this.hPos = hori_position;
    this.vPos = vert_position;
}

Position.prototype = {
    /**
     * Converts relative coordinates to absolute coordinates based
     * on the canvas dimensions (or specified dimensions).
     *
     * @param  Point  The relative point to convert
     * @param  Number The width to use for conversion (optional)
     * @param  Number The height to use for conversion (optional)
     * @return Point
     */
    convertPoint: function(point, p_width, p_height) {
        if(this == Anchor.TopLeft) {
            return new Point(point.x, point.y);
        }

        var width  = p_width | w;
        var height = p_height | h;
        var x, y;

        switch(this.hPos) {
            case HorizontalPosition.Left:
                x = point.x;
                break;
            case HorizontalPosition.Middle:
                x = width / 2 + point.x;
                break;
            case HorizontalPosition.Right:
                x = width - point.x;
                break;
        }
        switch(this.vPos) {
            case VerticalPosition.Top:
                y = point.y;
                break;
            case VerticalPosition.Middle:
                y = height / 2 + point.y;
                break;
            case VerticalPosition.Bottom:
                y = height - point.y;
                break;
        }

        return new Point(x, y);
    }
}

var Anchor = Object.freeze({
    TopLeft: new Position(HorizontalPosition.Left, VerticalPosition.Top),
    MiddleLeft: new Position(HorizontalPosition.Left, VerticalPosition.Middle),
    BottomLeft: new Position(HorizontalPosition.Left, VerticalPosition.Bottom),
    TopMiddle: new Position(HorizontalPosition.Middle, VerticalPosition.Top),
    MiddleMiddle: new Position(HorizontalPosition.Middle, VerticalPosition.Middle),
    BottomMiddle: new Position(HorizontalPosition.Middle, VerticalPosition.Bottom),
    TopRight: new Position(HorizontalPosition.Right, VerticalPosition.Top),
    MiddleRight: new Position(HorizontalPosition.Right, VerticalPosition.Middle),
    BottomRight: new Position(HorizontalPosition.Right, VerticalPosition.Bottom)
});
