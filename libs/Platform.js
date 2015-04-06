"use strict";

// position: Point containing the top left corner position
var Platform = function(position, anchor, width, height) {
    Entity.call(this, position, anchor);
    SolidEntity.call(this);
    this.width = width;
    this.height = height;
};

extend(Platform, SolidEntity, {
    getLeftX: function() {
        return this.position.x;
    }
    , getRightX: function() {
        return this.position.x + this.width;
    }
    , getTopY: function() {
        return this.position.y;
    }
    , getBottomY: function() {
        return this.position.y + this.height;
    }
    , setLeftX: function(x) {
        this.position.x = x;
        return this;
    }
    , setRightX: function(x) {
        this.position.x = x - this.width;
        return this;
    }
    , setTopY: function(y) {
        this.position.y = y;
        return this;
    }
    , setBottomY: function(y) {
        this.position.y = y - this.height;
        return this;
    }

    , move: function(to) { // to => center of the plateform
        if(to + this.width / 2 > w) {
            this.setRightX(w);
        } else if(to - this.width / 2 < 0) {
            this.setLeftX(0);
        } else {
            this.position.x = to - this.width/2;
        }
    }

    , draw: function(ctx) {
        // Shadow
        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width + 2,
            this.height + 2
        );
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.fillStyle = '#999';
        ctx.fill();
    }
    , handleCollision: function(ball, direction) {
        // Set the velocity rotation based on where the ball hit the platform
        var halfPlatform = this.width / 2;
        var platformCenter = this.getLeftX() + halfPlatform;
        var distance = Math.abs(ball.position.x - platformCenter);

        // Limit the rotation to 0.7 %
        var percent = Math.min(0.7, distance / halfPlatform);
        var rotation = 3 * half_pi;
        if(ball.position.x < platformCenter) {
            rotation -= percent * half_pi;
        } else {
            rotation += percent * half_pi;
        }
        ball.velocity = ball.velocity.setRotation(rotation);
    }

    , containerWidthChanged: function(width) {
        if(this.getRightX() > width) {
            this.setRightX(width);
        }
    }
    , containerHeightChanged: function(height) {
        this.setBottomY(height - 5);
    }
});
