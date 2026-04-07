import Renderer from "./Renderer.js";
import Pawn from "./Pawn.js"

export default class CheckBoard{
constructor(size){
       this.checkBoard = [
        ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"],
        ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"],
        ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"],
        ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
        ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"],
        ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"],
        ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"],
        ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"]


        ];

        this.instance = null;

        this.renderer = Renderer.getInstance();
        this.canvas = this.renderer.getCanvas();
        this.size = size;
        this.pawnsWhite = [];
        this.pawnsBlack = [];
        this.createPawns();
    }

    createPawns = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) { // Tylko czarne pola
                if (i < 3) {
                    this.pawnsWhite.push(new Pawn(i, j, this.size, "white"));
                } else if (i > 4) {
                    this.pawnsBlack.push(new Pawn(i, j, this.size, "black"));
                }
            }
        }
    } 
}

draw = () => {
    for(let  i = 0; i < this.checkBoard.length; i++){
      
            for(let j = 0; j < this.checkBoard[i].length; j++){
                if((i + j)%2 === 0){
                    this.renderer.drawRect(j * this.size, i* this.size, this.size, this.size, "#EEEED2")
                }else{
                    this.renderer.drawRect(j * this.size, i* this.size, this.size, this.size, "#769656")
                }
            }
        }

        this.pawnsWhite.forEach(pawn => pawn.draw());
        this.pawnsBlack.forEach(pawn => pawn.draw());
    }
getPawnsBlack = () => {
    return this.pawnsBlack;
}

getPawnsWhite = () => {
    return this.pawnsWhite;
}

   
}





