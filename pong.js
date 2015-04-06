"use strict";

// TODO Reset button
// TODO Config like http://workshop.chromeexperiments.com/examples/gui/
// TODO Move away from requirejs at some point

/**
 * Constants
 */
var half_pi = Math.PI / 2;
var ballRadius = 15;
var platformWidth = 150;
var platformHeight = 15;
var libs = [
    'libs/Vector',
    'libs/Point',
    'libs/Positions',
    'libs/Entity',
    'libs/SolidEntity',
    'libs/Ball',
    'libs/LifeCounter',
    'libs/Text',
    'libs/Platform',
    'libs/PlatformAI',
    'libs/Timer',
    'libs/Wall'
];

var Direction = Object.freeze({
    Up: 0,
    Left: 1,
    Down: 2,
    Right: 3
});

/**
 * Globals
 */
var $pong = document.getElementById('pong');
var w = $pong.offsetWidth;
var h = $pong.offsetHeight;
var ctx = $pong.getContext('2d');
var lifes = 3;
var running = false;
var objects = [];

/**
 * Utility functions
 */
/**
 * Prototypal inheritance: Modifies the prototype of the child
 * object to chain the parent object and adds the provided properties
 * to the new prototype.
 *
 * @param  Function The child object
 * @param  Function The parent object
 * @param  Object   The new prototype of the child object
 */
var extend = function(clazz, parent, props) {
    clazz.prototype = Object.create(parent.prototype);
    for(var prop in props) {
        clazz.prototype[prop] = props[prop];
    }
};

/**
 * Checks wether a number is between to other numbers.
 *
 * @param  Number  The number to check
 * @param  Number  One of the bounds
 * @param  Number  The other bound
 * @return Boolean
 */
var isBetween = function(x, x1, x2) {
    var xMin = Math.min(x1, x2)
      , xMax = Math.max(x1, x2);
    return x > xMin && x < xMax;
}

/**
 * Do I need to explain random
 * @param  Number Min bound
 * @param  Number Max bound
 * @return Number The random
 */
var random = function(min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Y u read this?
 */
var emptyFunction = function() {};

// I don't want a single monster file, but this is meant for gh-pages
// so yeah.
window.addEventListener('load', function() { requirejs(libs, function() {
    /**
     * Actual code
     */
    var platform = new Platform(
        new Point(
            w / 2 - platformWidth / 2,
            5 + platformHeight
        ),
        Anchor.BottomLeft,
        platformWidth,
        platformHeight
    );
    var platformAi = new PlatformAI(
        new Point(w / 2 - platformWidth / 2, 5),
        Anchor.TopRight,
        platformWidth,
        platformHeight
    );
    var ball = new Ball(
        new Point(w / 2, h / 5),
        new Vector(0.1, 0.3),
        ballRadius,
        1.02,
        600
    );
    ball.randomizeRotation();
    var timer = new Timer(
        new Point(0, 0),
        Anchor.TopLeft,
        'rgba(255, 255, 255, 0.8)',
        '1.1rem sans-serif'
    );
    var lifeCounter = new LifeCounter(
        new Point(15, 15),
        Anchor.BottomRight,
        Direction.Up,
        lifes
    );
    var aiLifeCounter = new LifeCounter(
        new Point(15, 15),
        Anchor.TopRight,
        Direction.Down,
        lifes
    );
    var sizeChangedHandler = function() {
        if($pong.offsetWidth !== w) {
            objects.forEach(function(object) {
                object.containerWidthChanged($pong.offsetWidth);
            });
            w = $pong.offsetWidth;
            $pong.width = w;
        }
        if($pong.offsetHeight !== h) {
            objects.forEach(function(object) {
                object.containerHeightChanged($pong.offsetHeight);
            });
            h = $pong.offsetHeight;
            $pong.height = h;
        }
    };
    var endGameTextFactory = function(text) {
        return new Text(
            new Point(0, 0),
            Anchor.MiddleMiddle,
            text,
            'rgba(255, 150, 150, 0.8)',
            Alignement.Center,
            '2rem sans-serif'
        );
    }

    // Register the objects
    objects = objects.concat([
        ball,
        platform,
        platformAi,
        timer,
        lifeCounter,
        aiLifeCounter,
        new Wall(new Point(0, 0), false, true),
        new Wall(new Point(w, 0), false, true),
    ]);

    // Force canvas to take the size it actually takes.
    $pong.width = w;
    $pong.height = h;

    window.addEventListener('resize', sizeChangedHandler);
    window.addEventListener('deviceorientation', sizeChangedHandler);

    window.addEventListener('mousemove', function(e) {
        platform.move(e.clientX - $pong.offsetLeft);
    });

    // TODO Keyboard control?

    // Touch handling
    window.addEventListener('touchmove', function(e) {
        platform.move(e.changedTouches[0].clientX - $pong.offsetLeft);
    }, false);
    window.addEventListener('touchstart', function(e) {
        platform.move(e.changedTouches[0].clientX - $pong.offsetLeft);
    }, false);

    $pong.addEventListener('draw', function(e) {
        var ctx = e.detail;
        ctx.clearRect(0, 0, w, h);
        objects.forEach(function(object) {
            object.draw(ctx);
        });
    });

    $pong.addEventListener('update', function(e) {
        objects.forEach(function(object) {
            object.update(e.detail, objects);
        });
    });

    $pong.addEventListener('life_lost', function() {
        if(lifeCounter.count-- <= 0) {
            $pong.dispatchEvent(new Event('user_lost_game'));
        }
    });
    $pong.addEventListener('ai_life_lost', function() {
        if(aiLifeCounter.count-- <= 0) {
            $pong.dispatchEvent(new Event('ai_lost_game'));
        }
    });

    $pong.addEventListener('user_lost_game', function() {
        var text = endGameTextFactory('You lose!');
        objects.push(text);
        text.draw(ctx);
        $pong.dispatchEvent(new Event('game_end'));
    });

    $pong.addEventListener('ai_lost_game', function() {
        var text = endGameTextFactory('You win!');
        objects.push(text);
        text.draw(ctx);
        $pong.dispatchEvent(new Event('game_end'));
    });

    $pong.addEventListener('game_end', function() {
        running = false;
    });

    var game_loop = function(time) {
        $pong.dispatchEvent(new CustomEvent('draw', { detail: ctx }));
        $pong.dispatchEvent(new CustomEvent('update', { detail: time }));
        if(running) {
            requestAnimationFrame(game_loop);
        }
    };

    running = true;
    requestAnimationFrame(game_loop);
}); });
