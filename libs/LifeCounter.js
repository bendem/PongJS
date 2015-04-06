"use strict";

var LifeCounter = function(position, anchor, direction, count, radius, spacing) {
    Entity.call(this, position, anchor);
    this.count = count;
    this.direction = direction;
    this.radius = radius | 7;
    this.spacing = spacing | this.radius * 3;
}

extend(LifeCounter, Entity, {
    draw: function(ctx) {
        var i;

        // Depends on the direction
        var x_mod = 0, y_mod = 0;
        switch(this.direction) {
            case Direction.Left:
                x_mod = -this.spacing;
                break;
            case Direction.Right:
                x_mod = this.spacing;
                break;
            case Direction.Up:
                y_mod = -this.spacing;
                break;
            case Direction.Down:
                y_mod = this.spacing;
                break;
        }

        // Shadows
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        for (i = this.count - 1; i >= 0; --i) {
            ctx.arc(
                this.position.x + x_mod * i + 1,
                this.position.y + y_mod * i + 1,
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
                this.position.x + x_mod * i,
                this.position.y + y_mod * i,
                7,
                0,
                2 * Math.PI
            );
        }
        ctx.fill();
    }
});
