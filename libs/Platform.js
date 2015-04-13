// position: Point containing the top left corner position
var Platform = function(position, anchor, width, height) {
    Entity.call(this, position, anchor);
    SolidEntity.call(this);
    this.width = width;
    this.height = height;

    var losingLineAnchor;
    switch(anchor) {
        case Anchor.TopMiddle:
        case Anchor.MiddleLeft:
            losingLineAnchor = Anchor.TopLeft;
            break;
        case Anchor.BottomMiddle:
            losingLineAnchor = Anchor.BottomLeft;
            break;
        case Anchor.MiddleRight:
            losingLineAnchor = Anchor.TopRight;
            break;
    }

    this.losingLine = new LosingLine(
        new Point(0, 0),
        losingLineAnchor,
        this,
        anchor.vPos == VerticalPosition.Middle
    );

    entityList.register(this.losingLine);
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

    , drawShadow: function(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width + 2,
            this.height + 2
        );
        ctx.fill();
    }

    , draw: function(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.fill();
    }
    , handleCollision: function(ball, direction) {
        // Set the velocity rotation based on where the ball hit the platform
        var halfPlatform, platformCenter, distance, ballPos;
        if(direction % 2 == 0) { // horizontal
            halfPlatform = this.width / 2;
            platformCenter = this.getLeftX() + halfPlatform;
            ballPos = ball.position.x;
        } else {
            halfPlatform = this.height / 2;
            platformCenter = this.getTopY() + halfPlatform;
            ballPos = ball.position.y;
        }
        distance = Math.abs(ballPos - platformCenter);

        // Limit the rotation to 0.7 %
        var percent = Math.min(0.7, distance / halfPlatform);

        var directionRotation;
        switch(direction) {
            case Direction.Right:
                directionRotation = 0;
                break;
            case Direction.Up:
                directionRotation = 1;
                break;
            case Direction.Left:
                directionRotation = 2;
                break;
            case Direction.Down:
                directionRotation = 3;
                break;
        }

        var rotation = directionRotation * (Math.PI / 2);
        var sign = 1;
        // Directions greater than 1 are Down and Right
        if(ballPos < platformCenter && direction > 1
                || ballPos > platformCenter && direction < 2) {
            sign = -1;
        }
        rotation += percent * (Math.PI / 2) * sign;

        ball.velocity = ball.velocity.setRotation(rotation);
    }

    , containerWidthChanged: function(name, w) {
        if(this.getRightX() > w) {
            this.setRightX(w);
        }
    }
});
