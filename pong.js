"use strict";

// TODO Reset button
// TODO Config like http://workshop.chromeexperiments.com/examples/gui/
// TODO Move away from requirejs at some point

/**
 * Constants
 */
var fps = 60;
var half_pi = Math.PI / 2;
var ballRadius = 15;
var platformWidth = 150;
var platformHeight = 15;
var libs = [
    'libs/Vector',
    'libs/Point',
    'libs/Entity',
    'libs/SolidEntity',
    'libs/Ball',
    'libs/LifeCounter',
    'libs/LostText',
    'libs/Platform',
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
var game_loop;

/**
 * Utility functions
 */
// Add all properties of an object to another
// (Usefull to extend the prototype of an object)
var extend = function(clazz, parent, props) {
    clazz.prototype = Object.create(parent.prototype);
    for(var prop in props) {
        clazz.prototype[prop] = props[prop];
    }
};
var random = function(min, max) {
    return Math.random() * (max - min) + min;
};
var emptyFunction = function() {};

// I don't want a single monster file, but this is meant for gh-pages
// so yeah.
window.addEventListener('load', function() { requirejs(
    libs,
    function() {
        /**
         * Actual code
         */
        var platform = new Platform(
                new Point(
                    w / 2 - platformWidth / 2,
                    h - platformHeight - 5
                ),
                platformWidth,
                platformHeight
            )
            , ball = new Ball(
                new Point(w / 2, h / 5),
                new Vector(0.1, 0.3).setRotation(Math.random() * 2 * Math.PI),
                ballRadius,
                1.02,
                600
            )
            , timer = new Timer(
                new Point(0, 0),
                'rgba(255, 255, 255, 0.8)',
                '1.1rem sans-serif'
            )
            , lifeCounter = new LifeCounter(
                new Point(w - 15, 15),
                lifes,
                22
            )
            , objects = [
                ball,
                platform,
                timer,
                lifeCounter,
                new Wall(new Point(0, 0), false, true),
                new Wall(new Point(0, 0), true, false),
                new Wall(new Point(w, 0), false, true),
            ]
            , sizeChangedHandler = function() {
                if($pong.offsetWidth !== w) {
                    objects.forEach(function(object) {
                        object.containerWidthChanged($pong.offsetWidth);
                    });
                }
                if($pong.offsetHeight !== h) {
                    objects.forEach(function(object) {
                        object.containerHeightChanged($pong.offsetHeight);
                    });
                }

                w = $pong.offsetWidth;
                h = $pong.offsetHeight;
                $pong.width = w;
                $pong.height = h;
                // Force redrawing to prevent black frames
                $pong.dispatchEvent(new CustomEvent('draw', { detail: ctx }));
            }
            ;

        $pong.width = w;
        $pong.height = h;

        window.addEventListener('resize', sizeChangedHandler);
        window.addEventListener('deviceorientation', sizeChangedHandler);

        window.addEventListener('mousemove', function(e) {
            platform.move(e.clientX - $pong.offsetLeft);
        });

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
                $pong.dispatchEvent(new Event('game_lost'));
            }
        });

        $pong.addEventListener('game_lost', function() {
            clearInterval(game_loop);
            console.log('YOU LOST BIATCH!');
            var text = new LostText(
                'You lose!',
                'rgba(255, 150, 150, 0.8)',
                '2rem sans-serif'
            );
            objects.push(text);
            text.draw(ctx);
        });

        game_loop = setInterval(function() {
            $pong.dispatchEvent(new CustomEvent('draw', { detail: ctx }));
            $pong.dispatchEvent(new CustomEvent('update', { detail: Date.now() }));
        }, 1000/fps);
    }
); });
