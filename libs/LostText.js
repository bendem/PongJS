"use strict";

var LostText = function(text, style, font) {
    this.text = text;
    this.style = style;
    this.font = font;
};

LostText.prototype = extend(new Entity(), {
    draw: function(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.style;
        var dimensions = ctx.measureText(this.text);
        ctx.fillText(
            this.text,
            w / 2 - dimensions.width / 2, // Center the text
            h / 3
        );
    }
});
