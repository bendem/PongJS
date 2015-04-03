"use strict";

var LifeCounter = function(position, count, spacing, radius) {
    Entity.call(this, position);
    this.count = count;
    this.spacing = spacing;
    this.radius = radius | 7;
}

extend(LifeCounter, Entity, {
    draw: function(ctx) {
        var i;
        // Shadows
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        for (i = this.count - 1; i >= 0; --i) {
            ctx.arc(
                this.position.x + 1,
                this.position.y + this.spacing * i + 1,
                8,
                0,
                2 * Math.PI
            );
        }
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (i = this.count - 1; i >= 0; --i) {
            ctx.arc(
                this.position.x,
                this.position.y + this.spacing * i,
                7,
                0,
                2 * Math.PI
            );
        }
        ctx.fill();
    }
});
