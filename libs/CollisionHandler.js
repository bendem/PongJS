var CollisionHandler = function(ball) {
    this.ball = ball;
};

CollisionHandler.prototype = {
    handleCollisions: function(objects, delta) {
        var ball = this.ball;
        var actualVelocity = ball.velocity.multiply(delta);
        var goingUp = ball.velocity.y < 0;
        var goingLeft = ball.velocity.x < 0;

        objects.forEach(function(obj) {
            if(obj == ball || !obj.solid) {
                // Don't handle collision with yourself or non solid objects
                return;
            }

            // TODO have collision checking functions returning intersection(s) point

            // Horizontal collision
            if(goingLeft
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getRightX(),
                        ball.getLeftX(),
                        ball.getLeftX() + actualVelocity.x
                    )
                    // Will actually go through
                    && ball.getBottomY() > obj.getTopY()
                    && ball.getTopY() < obj.getBottomY()) {
                obj.handleCollision(ball, Direction.Left);
            } else if(!goingLeft
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getLeftX(),
                        ball.getRightX(),
                        ball.getRightX() + actualVelocity.x
                    )
                    // Will actually go through
                    && ball.getBottomY() > obj.getTopY()
                    && ball.getTopY() < obj.getBottomY()) {
                obj.handleCollision(ball, Direction.Right);
            }

            // Vertical collision
            if(goingUp
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getBottomY(),
                        ball.getTopY(),
                        ball.getTopY() + actualVelocity.y
                    )
                    // Will actually go through
                    && ball.getRightX() > obj.getLeftX()
                    && ball.getLeftX() < obj.getRightX()) {
                obj.handleCollision(ball, Direction.Up);
            } else if(!goingUp
                    // Will pass the object in this frame
                    && isBetween(
                        obj.getTopY(),
                        ball.getBottomY(),
                        ball.getBottomY() + actualVelocity.y
                    )
                    // Will actually go through
                    && ball.getRightX() > obj.getLeftX()
                    && ball.getLeftX() < obj.getRightX()) {
                obj.handleCollision(ball, Direction.Down);
            }

            actualVelocity = ball.velocity.multiply(delta);
        }, this);
    }
};
