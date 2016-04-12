export default class Grid {

    constructor(size) {
        this.gridSize = size;
        this.grid = $('#grid');
    }

    draw() {
        let width = this.grid.width(),
            height = this.grid.height();

        for(let i = 0; (this.gridSize.x + i) < (width + this.gridSize.x); i+=this.gridSize.x) {
            for(let v = 0; (this.gridSize.y + v) < (height + this.gridSize.y); v+=this.gridSize.y) {
                this.grid.append($('<div class="grid-line"></div>').css({
                    width: this.gridSize.x + 'px',
                    height: this.gridSize.y + 'px',
                    left: i + 'px',
                    top: v + 'px'
                }));
            }
        }

        return this;
    }

    remove() {
        this.grid.empty();

        return this;
    }

    setSize(size) {
        if(typeof size !== "object") {
            throw new Error('Invalid size, expecting object received ' + (typeof size));
        }
        this.gridSize = size;
        this.remove();
        this.draw();
    }

    getSize() {
        return this.gridSize;
    }

    snapToGrid(position) {
        return {
            x: position.x - (position.x % this.gridSize.x),
            y: position.y - (position.y % this.gridSize.y)
        };
    }

}