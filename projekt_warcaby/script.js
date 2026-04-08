import Renderer from "./Renderer.js";
import CheckBoard from "./CheckBoard.js";
import Pawn from "./Pawn.js";



class Game {
    constructor() {
        this.renderer = Renderer.getInstance();
        this.context = this.renderer.getContext2d();
        this.canvas = this.renderer.getCanvas();
        this.checkBoard = new CheckBoard(this.canvas.width / 8);
        this.pawns = [];
        

        this.canvas.addEventListener("mousedown", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const col = Math.floor(x / this.checkBoard.size);
            const row = Math.floor(y / this.checkBoard.size);

            this.checkBoard.handleSelect(row, col);
        })

     


        this.startGame();
    }

    startGame = () => {
        const fps = 60;
        setInterval(() => this.updateGame(), 1000/fps);
        this.checkBoard.createPawns();
    }

    updateGame = () => {
       
        
        if(this.checkBoard.pawnsWhite.length === 0){
            this.renderer.drawText("Czarne wygrywają!!!", 200, 200, "red");
            setTimeout(() => this.restartGame(),1000);
        }
            if(this.checkBoard.pawnsBlack.length === 0){
            this.renderer.drawText("Białe wygrywają!!!", 200, 200, "red");
            setTimeout(() => this.restartGame(),1000);

        }

        this.render();
    }

    restartGame = () => {
        this.renderer.clear();
        this.checkBoard.pawnsWhite = [];
        this.checkBoard.pawnsBlack = [];
        this.checkBoard.draw();
        this.checkBoard.createPawns();
        this.checkBoard.turn = "white";
        this.checkBoard.selectedPawn = null;
        
    }

    render = () => {
        this.checkBoard.draw();
        
    }
}

new Game();