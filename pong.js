"use strict";

/**
 * Constants
 */
var fps = 60;
var half_pi = Math.PI / 2;
var ballRadius = 15;
var platformWidth = 150;
var platformHeight = 15;

/**
 * Globals
 */
var $pong = document.getElementById('pong');
var w = $pong.offsetWidth;
var h = $pong.offsetHeight;
var ctx = $pong.getContext('2d');
var lifes = 3;
var game_loop;

// I don't want a single monster file, but this is meant for gh-pages
// so yeah.
window.addEventListener('load', function() { requirejs(
    ['libs/Vector', 'libs/Point', 'libs/Ball', 'libs/Platform', 'libs/LostText'],
    function() {
        /**
         * Actual code
         */
        // TODO Maybe make ball and platform extend Entity (they got a bunch of stuff in common)?
        var platform = new Platform(
            new Point(
                w / 2 - platformWidth / 2,
                h - platformHeight
            ),
            platformWidth,
            platformHeight
        );
        var ball = new Ball(
            new Point(ballRadius, ballRadius),
            new Vector(.1, .3),
            ballRadius,
            1.01,
            5000,
            platform
        );
        var objects = [
            ball,
            platform
        ];

        $pong.width = w;
        $pong.height = h;

        var sizeChangedHandler = function(e) {
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
            // Force redrawing to prevent black frames
            $pong.dispatchEvent(new CustomEvent('draw', { detail: ctx }));
        }
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

        var drawLifes = function(ctx) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for(var i = 0; i < lifes; i++) {
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

        $pong.addEventListener('draw', function(e) {
            var ctx = e.detail;
            ctx.clearRect(0, 0, w, h);
            objects.forEach(function(object, _) {
                object.draw(ctx);
            });
            drawLifes(ctx);
        });

        $pong.addEventListener('update', function(e) {
            objects.forEach(function(object, _) {
                object.update(e.detail);
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
)});
