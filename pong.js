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

// Hi, I'm an horrible person
:include libs/Vector.js;
:include libs/Point.js;
:include libs/Ball.js;
:include libs/Platform.js;

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
