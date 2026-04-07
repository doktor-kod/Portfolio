import Renderer from "./Renderer.js";


export default class Pawn {
    constructor(row, col, size, color){
        this.color = color;
        this.row = row;
        this.col = col;
        this.size = size;
        this.selected = false;
        this.renderer = Renderer.getInstance();
        this.isQueen = false;



    }

        draw = () => {
        const centerX = this.col * this.size + this.size / 2;
        const centerY = this.row * this.size + this.size / 2;
        const radius = this.size * 0.4;
        if (this.selected) {
        this.renderer.drawCircle(centerX, centerY, radius + 5, "yellow"); // Obwódka zaznaczenia
    }
        this.renderer.drawCircle(centerX, centerY, radius, this.color);
         if(this.isQueen){
            this.renderer.drawText("D", centerX - 10, centerY + 10, "gold");
        }
    }
       
}

