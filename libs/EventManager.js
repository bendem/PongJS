var EventManager = function() {
    this.handlers = {};

    var self = this;
    window.addEventListener('resize', function() {
        self.handleResize();
    });
    window.addEventListener('deviceorientation', function() {
        self.handleResize();
    });
};

EventManager.prototype = {
    register: function(name, handler, obj, native) {
        // Registering a handler for multiple events at once
        if(name.forEach !== undefined) {
            name.forEach(function(name) {
                this.register(name, handler, obj);
            }, this);
            return;
        }

        var thing = {
            handler: handler,
            object: obj
        };

        if(!this.handlers.hasOwnProperty(name)) {
            // If not handled already, register the handler
            // and create the list.
            if(native) {
                var self = this;
                $pong.addEventListener(name, function(e) {
                    self.handleEvent(name, e);
                });
            }
            this.handlers[name] = [thing];
        } else {
            // Else, just add it to the list
            this.handlers[name].push(thing);
        }
        return this;
    }

    , handleEvent: function(name, arg) {
        if(!this.handlers.hasOwnProperty(name)) {
            return;
        }
        this.handlers[name].forEach(function(h) {
            h.handler.call(h.object, name, arg);
        });
    }

    , handleResize: function() {
        if($pong.offsetWidth !== w) {
            this.handleEvent('width_changed', w);
            w = $pong.offsetWidth;
            $pong.width = w;
        }
        if($pong.offsetHeight !== h) {
            this.handleEvent('height_changed', h);
            h = $pong.offsetHeight;
            $pong.height = h;
        }
    }
};


