var Ball = function(velocity, radius,
        velocityIncreaseRate, velocityIncreaseDelay) {
    Entity.call(this);
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

    this.collisionHandler = new CollisionHandler(this);

    // Time at which the ball got updated for the first time
    this.firstFrame = 0;
    // Last time at which the velocity got increased
    this.lastVelocityIncrease = 0;
    // Time at which the ball got last updated
    this.previousFrame = 0;

    eventManager.register('life_lost', this.reset, this);
    this.reset();
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
        // Shadow
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.arc(
            this.position.x + 1,
            this.position.y + 1,
            this.radius + 1,
            0,
            2 * Math.PI
        );
        ctx.fill();

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

    , randomizeRotation: function() {
        var rotation = random(Math.PI / 4, 3 / 4 * Math.PI);
        if(Math.random() > 0.5) {
            rotation = -rotation;
        }
        this.velocity = this.originalVelocity.setRotation(rotation);
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

        // Increase velocity every x seconds
        while(time - this.lastVelocityIncrease > this.velocityIncreaseDelay) {
            this.velocity = this.velocity.multiply(this.velocityIncreaseRate);
            this.lastVelocityIncrease += this.velocityIncreaseDelay;
        }

        // How long since last update?
        var delta = time - this.previousFrame;
        this.previousFrame = time;

        // Let collision handler do its things
        this.collisionHandler.handleCollisions(objects, delta);

        // Compute the actual velocity based on changes from the
        // collision handler and multiply by the time since last frame.
        var actualVelocity = this.velocity.multiply(delta);

        // Actually move the ball
        this.position.add(actualVelocity);
    }

    , reset: function() {
        this.position = Anchor.MiddleMiddle.convertPoint(new Point(0, 0));
        this.randomizeRotation();
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
