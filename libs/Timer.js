var Timer = function(position, anchor, font) {
    Entity.call(this, position, anchor);
    this.font = font;
    this.start = 0;
    this.timer = 0;

    // Inject a span in the dom to be able to get the font height
    var $span = document.createElement('span');
    $span.innerHTML = '0';
    $span.style.font = font;
    document.querySelector('body').appendChild($span);
    this.fontHeight = $span.offsetHeight;
    $span.remove();
    this.fontWidth = false;
};

extend(Timer, Entity, {
    drawShadow: function(ctx) {
        this.prepareDraw(ctx);

        ctx.font = this.font;
        ctx.fillText(
            this.timer,
            this.position.x + this.fontWidth + 1,
            this.position.y + this.fontHeight + 1
        );
    }

    , draw: function(ctx) {
        ctx.font = this.font;
        ctx.fillText(
            this.timer,
            this.position.x + this.fontWidth,
            this.position.y + this.fontHeight
        );
    }

    , prepareDraw: function(ctx) {
        if(this.fontWidth !== false) {
            return;
        }
        ctx.font = this.font;
        var dimensions = ctx.measureText('0');
        this.fontWidth = dimensions.width;
    }

    , update: function(now) {
        if(this.start === 0) {
            this.start = now;
        }
        this.timer = Math.round((now - this.start) / 1000);
    }
});
