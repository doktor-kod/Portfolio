import Renderer from "./Renderer.js";


export default class Pawn {
    constructor(row, col, size, color){
        this.color = color;
        this.row = row;
        this.col = col;
        this.size = size;
        this.renderer = Renderer.getInstance();



    }

        draw = () => {
        const centerX = this.col * this.size + this.size / 2;
        const centerY = this.row * this.size + this.size / 2;
        const radius = this.size * 0.4;
        this.renderer.drawCircle(centerX, centerY, radius, this.color);
    }
}

