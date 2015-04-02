"use strict";

var Timer = function(style, font) {
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

Timer.prototype = extend(new Entity(), {
    draw: function(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.style;
        var dimensions = ctx.measureText('0');
        ctx.fillText(
            this.timer,
            dimensions.width,
            this.fontHeight
        );
    }
    , update: function(now) {
        if(this.start === 0) {
            this.start = now;
        }
        this.timer = Math.round((now - this.start) / 1000);
    }
});
