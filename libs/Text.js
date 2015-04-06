"use strict";

var Alignement = Object.freeze({
    Left: 0,
    Center: 1,
    Right: 2
});

var Text = function(position, anchor, text, style, alignement, font) {
    Entity.call(this, position, anchor);
    this.text = text;
    this.style = style;
    this.alignement = alignement;
    this.font = font;
};

extend(Text, Entity, {
    draw: function(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.style;
        var dimensions = ctx.measureText(this.text);

        var offset = 0;
        switch(this.alignement) {
            case Alignement.Right:
                offset = dimensions.width;
                break;
            case Alignement.Center:
                offset = dimensions.width / 2;
                break;
        }
        ctx.fillText(
            this.text,
            this.position.x - offset,
            this.position.y
        );
    }
});
