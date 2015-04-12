var PlatformPlayer = function(position, anchor, width, height) {
    Platform.call(this, position, anchor, width, height);

    var self = this;
    eventManager.register('mousemove', this.handleMouseMove, this, true);
    eventManager.register(['touchstart', 'touchmove'], this.handleTouch, this, true);

    // TODO Keyboard control?
}

extend(PlatformPlayer, Platform, {
    handleMouseMove: function(name, e) {
        this.move(e.clientX - $pong.offsetLeft);
    }
    , handleTouch: function(name, e) {
        this.move(e.changedTouches[0].clientX - $pong.offsetLeft);
    }
})
