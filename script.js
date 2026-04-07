import Renderer from "./Renderer.js";
import CheckBoard from "./CheckBoard.js";
import Pawn from "./Pawn.js";



class Game {
    constructor() {
        this.renderer = Renderer.getInstance();
        this.context = this.renderer.getContext2d();
        this.canvas = this.renderer.getCanvas();
        this.checkBoard = new CheckBoard(this.canvas.width / 8);
        this.pawnsBlack = [];
        this.pawnsWhite = [];
    

     


        this.startGame();
    }

    startGame = () => {
        const fps = 60;
        setInterval(() => this.updateGame(), 1000/fps);
    }

    updateGame = () => {
        //logika gry

        

        this.render();
    }

    render = () => {
        this.checkBoard.draw();
        
    }
}

new Game();