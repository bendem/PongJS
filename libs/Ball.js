"use strict";

var isBetween = function(x, x1, x2) {
    var xMin = Math.min(x1, x2)
      , xMax = Math.max(x1, x2);
    return x > xMin && x < xMax;
}

var Ball = function(position, velocity, radius,
        velocityIncreaseRate, velocityIncreaseDelay, platform) {
    Entity.call(this, position)
    // Velocity of the ball (in unit per ms)
    this.velocity = velocity;
    // Radius of the ball
    this.radius = radius;
    // Increase rate of the velocity
    this.velocityIncreaseRate = velocityIncreaseRate;
    // Delay between velocity increase
    this.velocityIncreaseDelay = velocityIncreaseDelay;
    // The plateform (needed for collision handling)
    this.platform = platform;

    // Original velocity
    this.originalVelocity = this.velocity.clone();

    // Time at which the ball got updated for the first time
    this.firstFrame = 0;
    // Last time at which the velocity got increased
    this.lastVelocityIncrease = 0;
    // Time at which the ball got last updated
    this.previousFrame = 0;
};

extend(Ball, Entity, {
    // Get bounds of the ball
    getLeftX:   function() { return this.position.x - this.radius; }
    , getRightX:  function() { return this.position.x + this.radius; }
    , getTopY:    function() { return this.position.y - this.radius; }
    , getBottomY: function() { return this.position.y + this.radius; }

    , setLeftX: function(x) {
        this.position.x  = x + this.radius;
        return this;
    }
    , setRightX: function(x) {
        this.position.x = x - this.radius;
        return this;
    }
    , setTopY: function(y) {
        this.position.y = y + this.radius;
        return this;
    }
    , setBottomY: function(y) {
        this.position.y = y - this.radius;
        return this;
    }

    , draw: function(ctx) {
        // TODO Shadow
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }

    , initTimes: function(time) {
        this.firstFrame = time;
        this.lastVelocityIncrease = time;
        this.previousFrame = time;
    }

    , update: function(time, objects) {
        // First time we only get the time (used to compute next deltas)
        if(!this.previousFrame) {
            this.initTimes(time);
            return;
        }

        // Increase velocity every 5 seconds
        if(time - this.lastVelocityIncrease > this.velocityIncreaseDelay) {
            this.velocity = this.velocity.multiply(this.velocityIncreaseRate);
            this.lastVelocityIncrease = time;
        }

        var delta = time - this.previousFrame;
        this.previousFrame = time;

        var actualVelocity = this.velocity.multiply(delta);

        var goingUp = this.velocity.y < 0;
        var goingLeft = this.velocity.x < 0;
        var self = this;
        objects.forEach(function(obj) {
            if(obj == self || !obj.solid) {
                // Don't handle collision with yourself or non solid objects
                return;
            }

            // Horizontal collision
            if(goingLeft
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getRightX(),
                        self.getLeftX(),
                        self.getLeftX() + actualVelocity.x
                    )
                    // Will actually go through
                    && self.getBottomY() > obj.getTopY()
                    && self.getTopY() < obj.getBottomY()) {
                obj.handleCollision(self, Direction.Left);
            } else if(!goingLeft
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getLeftX(),
                        self.getRightX(),
                        self.getRightX() + actualVelocity.x
                    )
                    // Will actually go through
                    && self.getBottomY() > obj.getTopY()
                    && self.getTopY() < obj.getBottomY()) {
                obj.handleCollision(self, Direction.Right);
            }

            // Vertical collision
            if(goingUp
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getBottomY(),
                        self.getTopY(),
                        self.getTopY() + actualVelocity.y
                    )
                    // Will actually go through
                    && self.getRightX() > obj.getLeftX()
                    && self.getLeftX() < obj.getRightX()) {
                obj.handleCollision(self, Direction.Up);
            } else if(!goingUp
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getTopY(),
                        self.getBottomY(),
                        self.getBottomY() + actualVelocity.y
                    )
                    // Will actually go through
                    && self.getRightX() > obj.getLeftX()
                    && self.getLeftX() < obj.getRightX()) {
                obj.handleCollision(self, Direction.Down);
            }

            // Recompute the velocity
            actualVelocity = self.velocity.multiply(delta);
        });

        if(this.getBottomY() + actualVelocity.y > h) {
            $pong.dispatchEvent(new Event('life_lost'));
            this.position = new Point(w / 2, h / 5);
            // TODO Prevent that from being too vertical
            this.velocity = this.originalVelocity.setRotation(
                Math.random() * 2 * Math.PI
            );
            this.initTimes(time);
        }

        this.position.add(actualVelocity);
    }

    , containerWidthChanged: function(width) {
        if(this.getRightX() > width) {
            this.setRightX(width);
        }
    }

    , containerHeightChanged: function(height) {
        if(this.getBottomY() > height) {
            this.setBottomY(height);
        }
    }
});
