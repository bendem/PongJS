var EntityList = function() {
    this.entities = [];

    eventManager.register('update', this.update, this);
    eventManager.register('draw', this.draw, this);
}

EntityList.prototype = {
    register: function(entity) {
        this.entities.push(entity);
        return this;
    }

    , update: function(name, time) {
        this.entities.forEach(function(entity) {
            entity.update(time, this.entities);
        }, this);
        return this;
    }

    , draw: function(name, ctx) {
        ctx.clearRect(0, 0, w, h);
        this.entities.forEach(function(entity) {
            entity.draw(ctx);
        }, this);
        return this;
    }
}
