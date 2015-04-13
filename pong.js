// TODO Reset button
// TODO Config like http://workshop.chromeexperiments.com/examples/gui/

/**
 * Globals
 */
var w;
var h;
var $pong;
var entityList;
var eventManager;

window.addEventListener('load', function() {
    var ctx;
    var running;

    $pong = document.getElementById('pong');
    w     = $pong.offsetWidth;
    h     = $pong.offsetHeight;
    ctx   = $pong.getContext('2d')
    eventManager = new EventManager();
    entityList = new EntityList();

    /**
     * All the entities
     */
    entityList
        .register(new Ball(
            new Vector(0.1, 0.3),
            ballRadius,
            1.02,
            600
        ))
        .register(new PlatformPlayer(
            new Point(
                -platformWidth / 2,
                5 + platformHeight
            ),
            Anchor.BottomMiddle,
            platformWidth,
            platformHeight
        ))
        .register(new PlatformAI(
            new Point(-platformWidth / 2, 5),
            Anchor.TopMiddle,
            platformWidth,
            platformHeight
        ))
        .register(new Timer(
            new Point(0, 0),
            Anchor.TopLeft,
            '1.1rem sans-serif'
        ))
        .register(new Wall(new Point(0, 0), Anchor.TopLeft, false, true))
        .register(new Wall(new Point(0, 0), Anchor.TopRight, false, true))
        ;

    // Force canvas to take the size it actually takes.
    $pong.width = w;
    $pong.height = h;

    eventManager.register('game_end', function(name, source) {
        var aiWon = source instanceof PlatformPlayer;
        entityList.register(new Text(
            new Point(0, -35),
            Anchor.MiddleMiddle,
            (aiWon ? 'AI' : 'Player') + ' wins',
            aiWon ? 'rgba(250, 100, 100, 0.8)' : 'rgba(100, 100, 250, 0.8)',
            Alignement.Center,
            '2rem sans-serif'
        ));

        // Force to draw the text, perf doesn't really matter at this point
        eventManager.handleEvent('draw', ctx);
        running = false;
    });

    var game_loop = function(time) {
        eventManager.handleEvent('draw', ctx);
        if(running) {
            requestAnimationFrame(game_loop);
        }

        // Execute game logic in a callback so it does not prevent
        // the animation frame from ending.
        // http://impactjs.com/forums/impact-engine/misuse-of-requestanimationframe
        setTimeout(function() {
            eventManager.handleEvent('update', time);
        }, 0);
    };

    // Holy the setup is done, we can launch the game
    running = true;
    requestAnimationFrame(game_loop);
});
