"use strict";

var Timer = function(position, style, font) {
    Entity.call(this, position);
    this.style = style;
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
};

extend(Timer, Entity, {
    draw: function(ctx) {
        var dimensions = ctx.measureText('0');
        ctx.font = this.font;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillText(
            this.timer,
            this.position.x + dimensions.width + 1,
            this.position.y + this.fontHeight + 1
        );

        ctx.fillStyle = this.style;
        ctx.fillText(
            this.timer,
            this.position.x + dimensions.width,
            this.position.y + this.fontHeight
        );
    }
    , update: function(now) {
        if(this.start === 0) {
            this.start = now;
        }
        this.timer = Math.round((now - this.start) / 1000);
    }
});
