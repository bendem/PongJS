var Ball = function(position, velocity, radius,
        velocityIncreaseRate, velocityIncreaseDelay) {
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
        // TODO Handle collision with the platform somewhere in here
        // TODO When colliding, the velocity rotation should be set
        //      based on the distance from the center of the platform

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
        var actualVelocity = this.velocity.multiply(delta);

        // TODO Don't just reverse the velocity. Bounce against the wall!
        // -------
        //   /\
        //  /  o
        // /
        if(this.getLeftX() + actualVelocity.x < 0
                || this.getRightX() + actualVelocity.x > w) {
            this.velocity.x *= -1;
        }

        if(this.getTopY() + actualVelocity.y < 0) {
            this.velocity.y *= -1;
        } else if(this.getBottomY() + actualVelocity.y > h) {
            if(lifes-- <= 0) {
                clearInterval(game_loop);
                console.log('YOU LOST BIATCH!');
                // TODO Drawing doesn't really belong here, maybe add an event or smt
                // TODO Don't steal ctx from the global scope (bad dev!)
                // TODO Since the text is not in the object list,
                //      resizing redraw the canvas without it
                ctx.font = '2rem sans-serif';
                ctx.fillStyle = 'rgba(255, 150, 150, 0.8)';
                var dimensions = ctx.measureText('You loose!');
                console.log(dimensions);
                ctx.fillText(
                    'You loose!',
                    w / 2 - dimensions.width / 2, // Center the text
                    h / 3
                );
                return;
            }
            this.setTopY(0);
            this.velocity = this.originalVelocity;
            this.initTimes(time);
        }

        this.position.add(actualVelocity);
        this.previousFrame = time;
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
