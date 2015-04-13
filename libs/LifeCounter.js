var LifeCounter = function(position, anchor, direction, losingLine,
        count, radius, spacing) {
    Entity.call(this, position, anchor);
    this.direction = direction;
    this.losingLine = losingLine;
    this.count = count;
    this.radius = radius || 7;
    this.spacing = spacing || this.radius * 3;

    eventManager.register('life_lost', this.handleLifeLost, this);
}

extend(LifeCounter, Entity, {
    drawShadow: function(ctx) {
        this.prepareDraw();

        ctx.beginPath();
        for (var i = this.count - 1; i >= 0; --i) {
            ctx.arc(
                this.position.x + this.x_mod * i + 1,
                this.position.y + this.y_mod * i + 1,
                8,
                0,
                2 * Math.PI
            );
        }
        ctx.fill();
    }

    , draw: function(ctx) {
        ctx.beginPath();
        for (var i = this.count - 1; i >= 0; --i) {
            ctx.arc(
                this.position.x + this.x_mod * i,
                this.position.y + this.y_mod * i,
                7,
                0,
                2 * Math.PI
            );
        }
        ctx.fill();
    }

    , prepareDraw: function() {
        this.x_mod = 0, this.y_mod = 0;
        switch(this.direction) {
            case Direction.Left:
                this.x_mod = -this.spacing;
                break;
            case Direction.Right:
                this.x_mod = this.spacing;
                break;
            case Direction.Up:
                this.y_mod = -this.spacing;
                break;
            case Direction.Down:
                this.y_mod = this.spacing;
                break;
        }
    }

    , handleLifeLost: function(name, source) {
        if(source != this.losingLine) {
            // Targeted to another counter
            return;
        }

        if(this.count-- <= 0) {
            eventManager.handleEvent('game_end', source.platform);
        }
    }
});
