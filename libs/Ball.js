"use strict";

var Ball = function(position, velocity, radius,
        velocityIncreaseRate, velocityIncreaseDelay, platform) {
    // Center of the ball
    this.position = position;
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
}

Ball.prototype = {
    // Get bounds of the ball
    getLeftX:   function() { return this.position.x - this.radius; },
    getRightX:  function() { return this.position.x + this.radius; },
    getTopY:    function() { return this.position.y - this.radius; },
    getBottomY: function() { return this.position.y + this.radius; },

    setLeftX: function(x) {
        this.position.x  = x + this.radius;
        return this;
    },
    setRightX: function(x) {
        this.position.x = x - this.radius;
        return this;
    },
    setTopY: function(y) {
        this.position.y = y + this.radius;
        return this;
    },
    setBottomY: function(y) {
        this.position.y = y - this.radius;
        return this;
    },

    draw: function(ctx) {
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
    },

    initTimes: function(time) {
        this.firstFrame = time;
        this.lastVelocityIncrease = time;
        this.previousFrame = time;
    },

    update: function(time) {
        if(!this.previousFrame) {
            // First time we only get the time (used to compute next deltas)
            this.initTimes(time);
            return;
        }

        // Increase velocity every 5 seconds
        if(time - this.lastVelocityIncrease > this.velocityIncreaseDelay) {
            this.velocity = this.velocity.multiply(this.velocityIncreaseRate);
            this.lastVelocityIncrease = time;
            console.debug('Increasing velocity: ' + this.velocity.getLength());
        }

        var delta = time - this.previousFrame;
        this.previousFrame = time;

        var actualVelocity = this.velocity.multiply(delta);

        // Collision with the platform
        if(actualVelocity.y > 0) {
            if(this.getBottomY() + actualVelocity.y >= this.platform.getTopY()
                    && this.getLeftX() < this.platform.getRightX()
                    && this.getRightX() > this.platform.getLeftX()) {
                // Set the velocity rotation based on where the ball hit the platform
                var halfPlatform = this.platform.width / 2;
                var platformCenter = this.platform.getLeftX() + halfPlatform;
                var distance = Math.abs(this.position.x - platformCenter);

                // Limit the rotation to .7 %
                var percent = Math.min(.7, distance / halfPlatform);
                var rotation = 3 * half_pi;
                if(this.position.x < platformCenter) {
                    rotation -= percent * half_pi;
                } else {
                    rotation += percent * half_pi;
                }
                this.velocity = this.velocity.setRotation(rotation);

                // Recompute the velocity
                actualVelocity = this.velocity.multiply(delta);
            }
        }

        // TODO Don't just reverse the velocity. Bounce against the wall!
        // -------
        //   /\
        //  /  o
        // /
        if(this.getLeftX() + actualVelocity.x < 0) {
            this.velocity.x = Math.abs(this.velocity.x);
        } else if(this.getRightX() + actualVelocity.x > w) {
            this.velocity.x = -Math.abs(this.velocity.x);
        }

        if(this.getTopY() + actualVelocity.y < 0) {
            this.velocity.y = Math.abs(this.velocity.y);
        } else if(this.getBottomY() + actualVelocity.y > h) {
            $pong.dispatchEvent(new Event('life_lost'));
            this.setTopY(0);
            this.velocity = this.originalVelocity;
            this.initTimes(time);
        }

        this.position.add(actualVelocity);
    },

    containerWidthChanged: function(width) {
        if(this.getRightX() > width) {
            this.setRightX(width);
        }
    },

    containerHeightChanged: function(height) {
        if(this.getBottomY() > height) {
            this.setBottomY(height);
        }
    }
}
