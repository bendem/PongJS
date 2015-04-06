"use strict";

var PlatformAI = function(position, anchor, width, height) {
    Platform.call(this, position, anchor, width, height);
};

extend(PlatformAI, Platform, {
    update: function(now, objects) {
        if(!this.ball) {
            for (var i = 0; i < objects.length; ++i) {
                if(objects[i] instanceof Ball) {
                    this.ball = objects[i];
                    break;
                }
            }
            this.previousFrame = now;
            return;
        }

        var platformCenter = this.getLeftX() + (this.width / 2);
        var distance = Math.min(
            // Distance wanted
            Math.abs(this.ball.position.x - platformCenter),
            // Rate limiting
            Math.abs(this.ball.velocity.multiply(now - this.previousFrame).x) * 0.9
        );

        if (platformCenter < this.ball.position.x) {
            this.move(platformCenter + distance);
        } else {
            this.move(platformCenter - distance);
        }

        this.previousFrame = now;
    }
});
