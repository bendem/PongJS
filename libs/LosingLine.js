var LosingLine = function(position, anchor, platform, vertical) {
    Wall.call(this, position, anchor, !vertical, vertical);
    this.platform = platform;

    var lifeCounterAnchor;
    if(anchor == Anchor.TopLeft) {
        lifeCounterAnchor = vertical ? Anchor.TopLeft : Anchor.TopRight;
    } else {
        lifeCounterAnchor = vertical ? Anchor.BottomLeft : Anchor.BottomRight;
    }

    this.lifeCounter = new LifeCounter(
        new Point(15, 15),
        lifeCounterAnchor,
        lifeCounterAnchor.vPos == VerticalPosition.Top
            ? Direction.Down : Direction.Up,
        this,
        lifes
    );

    entityList.register(this.lifeCounter);
};

extend(LosingLine, Wall, {
    handleCollision: function(ball, direction) {
        eventManager.handleEvent('life_lost', this);
    }

    // , draw: function(ctx) {
    //     ctx.beginPath();
    //     ctx.rect(
    //         this.position.x - 1,
    //         this.position.y - 1,
    //         this.hasWidth ? w : 2,
    //         this.hasHeight ? h : 2
    //     );
    //     ctx.fillStyle = '#559';
    //     ctx.fill();
    // }
});
