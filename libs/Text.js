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

    this.offset = false;
};

extend(Text, Entity, {
    drawShadow: function(ctx) {
        this.prepareDraw(ctx);

        ctx.font = this.font;
        ctx.fillText(
            this.text,
            this.position.x - this.offset + 1,
            this.position.y + 1
        );
    }
    , draw: function(ctx) {
        ctx.font = this.font;
        // Save the canvas style since we change the fillStyle.
        ctx.save();
        ctx.fillStyle = this.style;
        ctx.fillText(
            this.text,
            this.position.x - this.offset,
            this.position.y
        );
        ctx.restore();
    }

    , prepareDraw: function(ctx) {
        if(this.offset !== false) {
            return;
        }

        ctx.font = this.font;
        var dimensions = ctx.measureText(this.text);

        this.offset = 0;
        switch(this.alignement) {
            case Alignement.Right:
                this.offset = dimensions.width;
                break;
            case Alignement.Center:
                this.offset = dimensions.width / 2;
                break;
        }
    }
});
