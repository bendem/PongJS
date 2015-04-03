"use strict";

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
    'libs/Ball',
    'libs/Platform',
    'libs/LostText',
    'libs/Timer'
];

/**
 * Globals
 */
var $pong = document.getElementById('pong');
var w = $pong.offsetWidth;
var h = $pong.offsetHeight;
var ctx = $pong.getContext('2d');
var lifes = 3;
var game_loop;

// Add all properties of an object to another
// (Usefull to extend the prototype of an object)
function extend(clazz, parent, props) {
    for(var prop in props) {
        clazz.prototype[prop] = props[prop];
    }
    Object.setPrototypeOf(clazz.prototype, parent.prototype);
}

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
                    h - platformHeight
                ),
                platformWidth,
                platformHeight
            )
            , ball = new Ball(
                new Point(w / 2, h / 5),
                new Vector(0.1, 0.3).setRotation(Math.random() * 2 * Math.PI),
                ballRadius,
                1.02,
                600,
                platform
            )
            , timer = new Timer('rgba(255, 255, 255, 0.8)', '1.1rem sans-serif')
            , objects = [
                ball,
                platform,
                timer
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
            , drawLifes = function(ctx) {
                var i;
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                for(i = 0; i < lifes; i++) {
                    ctx.arc(
                        w - 15,
                        22 * i + 15,
                        7,
                        0,
                        2 * Math.PI
                    );
                }
                ctx.fill();
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
            drawLifes(ctx);
        });

        $pong.addEventListener('update', function(e) {
            objects.forEach(function(object) {
                object.update(e.detail, objects);
            });
        });

        $pong.addEventListener('life_lost', function() {
            if(lifes-- <= 0) {
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
