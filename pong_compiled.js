"use strict"

/**
 * Constants
 */
var fps = 60;
var $pong = document.getElementById('pong');
var w = $pong.offsetWidth;
var h = $pong.offsetHeight;
var ctx = $pong.getContext('2d');
var ballRadius = 15;
var platformWidth = 150;
var platformHeight = 15;
var lifes = 3;

// Vector is immutable
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    multiply: function(v) {
        return new Vector(this.x * v, this.y * v);
    },

    getRotation: function() {
        return Math.atan(this.y / this.x);
    },

    setRotation: function(rotation) {
        var current = this.getRotation();
        if(rotation == current) {
            return this.clone();
        }

        // TODO Check that works in all cases (rotation > current & rotation < current)?
        return this.rotate(rotation - current);
    },

    rotate: function(rotation) {
        if(rotation % 2 * Math.PI == 0) {
            return this.clone();
        }

        var x = Math.cos(rotation) * this.x + (-Math.sin(rotation) * this.y);
        var y = Math.sin(rotation) * this.x + Math.cos(rotation) * this.y;

        return new Vector(x, y);
    },

    getLength: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    setLength: function(length) {
        return this.normalize().multiply(length);
    },

    normalize: function() {
        var rotation = this.getRotation();
        return new Vector(Math.cos(rotation), Math.sin(rotation));
    },

    clone: function() {
        return new Vector(this.x, this.y);
    }
}
var Point = function(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype = {
    add: function(vector) {
        if(!vector instanceof Vector) {
            throw 'Invalid type';
        }
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
}
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
                // TODO Don't steal ctx from the global scope
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
// position: Point containing the top left corner position
var Platform = function(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;
}

Platform.prototype = {
    getLeftX: function() {
        return this.position.x;
    },
    getRightX: function() {
        return this.position.x + this.width;
    },
    getTopY: function() {
        return this.position.y;
    },
    getBottomY: function() {
        return this.position.y + this.height;
    },

    setLeftX: function(x) {
        this.position.x = x;
        return this;
    },
    setRightX: function(x) {
        this.position.x = x - this.width;
        return this;
    },
    setTopY: function(y) {
        this.position.y = y;
        return this;
    },
    setBottomY: function(y) {
        this.position.y = y - this.height;
        return this;
    },

    move: function(to) { // to => center of the plateform
        if(to + this.width / 2 > w) {
            this.setRightX(w);
        } else if(to - this.width / 2 < 0) {
            this.setLeftX(0);
        } else {
            this.position.x = to - this.width/2;
        }
    },

    draw: function(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.fillStyle = '#999';
        ctx.fill();
    },

    update: function() {},

    containerWidthChanged: function(width) {
        if(this.getRightX() > width) {
            this.setRightX(width);
        }
    },

    containerHeightChanged: function(height) {
        this.setBottomY(height - 5);
    }
}

/**
 * Actual code
 */
// TODO Maybe make ball and platform extend Entity (they got a bunch of stuff in common)?
var ball = new Ball(
    new Point(ballRadius, ballRadius),
    new Vector(.1, .3),
    ballRadius,
    1.01,
    5000
);
var platform = new Platform(
    new Point(
        w / 2 - platformWidth / 2,
        h - platformHeight
    ),
    platformWidth,
    platformHeight
);
var objects = [
    ball,
    platform
];

$pong.width = w;
$pong.height = h;

window.addEventListener('resize', function(e) {
    if($pong.offsetWidth != w) {
        objects.forEach(function(object, _) {
            object.containerWidthChanged($pong.offsetWidth);
        });
    }
    if($pong.offsetHeight != h) {
        objects.forEach(function(object, _) {
            object.containerHeightChanged($pong.offsetHeight);
        });
    }

    w = $pong.offsetWidth;
    h = $pong.offsetHeight;
    $pong.width = w;
    $pong.height = h;
    drawAll(ctx);
});

window.addEventListener('mousemove', function(e) {
    platform.move(e.clientX - $pong.offsetLeft);
});

var init = function(ctx) {
    // Fill the canvas
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = '#222';
    ctx.fill();
}

var drawLifes = function(ctx) {
    for(var i = 0; i < lifes; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.arc(
            w - 15,
            22 * i + 15,
            7,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
}

var drawAll = function(ctx) {
    init(ctx);
    objects.forEach(function(object, _) {
        object.draw(ctx);
    });
    drawLifes(ctx);
}

var game_loop = setInterval(function() {
    var now = Date.now();
    drawAll(ctx);
    objects.forEach(function(object, _) {
        object.update(now);
    });
}, 1000/fps);
