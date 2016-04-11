export default class Grid {

    constructor(size = 50) {
        this.gridSize = size;
        this.grid = $('#grid');
    }

    draw() {
        let width = this.grid.width(),
            height = this.grid.height();

        for(let i = 0; (this.gridSize + i) < (width + this.gridSize); i+=this.gridSize) {
            for(let v = 0; (this.gridSize + v) < (height + this.gridSize); v+=this.gridSize) {
                this.grid.append($('<div class="grid-line"></div>').css({
                    width: this.gridSize + 'px',
                    height: this.gridSize + 'px',
                    left: i + 'px',
                    top: v + 'px'
                }));
            }
        }
    }

    remove() {
        this.grid.empty();
    }

}