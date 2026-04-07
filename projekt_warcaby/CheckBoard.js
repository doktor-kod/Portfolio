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
        this.turn = "white";
        this.pawnsWhite = [];
        this.pawnsBlack = [];
        this.selectedPawn = null;
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

handleSelect = (row, col) => {
    const allPawns = [...this.pawnsWhite, ...this.pawnsBlack];
    const clickedPawn = allPawns.find(p => p.row === row && p.col === col);
    if (clickedPawn && this.selectedPawn && this.selectedPawn.selected && clickedPawn !== this.selectedPawn) {
        return; 
    }

    if(clickedPawn){
        if(clickedPawn.color !==this.turn) return;
        if(this.selectedPawn) this.selectedPawn.selected = false;
        this.selectedPawn = clickedPawn;
        clickedPawn.selected = true;

    }else if(this.selectedPawn){

        const rowDiff = row - this.selectedPawn.row;
        const colDiff = Math.abs(col - this.selectedPawn.col);
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);
        const isCorrectDirection = (this.selectedPawn.color === "white") ? rowDiff === 1 : rowDiff === -1;
        const canMove = this.selectedPawn.isQueen ? absRowDiff ===1 : isCorrectDirection;
        if((row+ col)%2 !== 0 && colDiff === 1 && canMove){
            this.moveSelectedPawn(row, col)
        }else if (absRowDiff === 2 && absColDiff === 2){
            const midRow = (row + this.selectedPawn.row) /2;
            const midCol = (col + this.selectedPawn.col) /2;

            const midPawn = allPawns.find(p => p.row === midRow && p.col === midCol);
            if(midPawn && midPawn.color !== this.selectedPawn.color){
                this.pawnsWhite = this.pawnsWhite.filter(p => p !== midPawn);
                this.pawnsBlack = this.pawnsBlack.filter(p => p !== midPawn);

                this.moveSelectedPawn(row, col,true );

            }
        }
    }
}

canCaptureMore = (pawn) => {
    const allPawns = [...this.pawnsWhite, ...this.pawnsBlack];

    
    // Możliwe kierunki skoku o 2 pola (skosy)
    const directions = [
        { r: 2, c: 2 }, { r: 2, c: -2 },
        { r: -2, c: 2 }, { r: -2, c: -2 }
    ];

    return directions.some(d => {
        const targetRow = pawn.row + d.r;
        const targetCol = pawn.col + d.c;
        const midRow = pawn.row + d.r / 2;
        const midCol = pawn.col + d.c / 2;

        // Czy cel jest wewnątrz planszy?
        if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) return false;

        // Czy pole docelowe jest puste?
        const isTargetEmpty = !allPawns.find(p => p.row === targetRow && p.col === targetCol);
        // Czy na środku stoi przeciwnik?
        const midPawn = allPawns.find(p => p.row === midRow && p.col === midCol);
        const isOpponentInMid = midPawn && midPawn.color !== pawn.color;

        return isTargetEmpty && isOpponentInMid;
    });
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

moveSelectedPawn = (row, col, wasCapture = false) => {
    this.selectedPawn.row = row;
    this.selectedPawn.col = col;

    if(this.selectedPawn.color === "white" && row === 7){
        this.selectedPawn.isQueen = true;
    }
        if(this.selectedPawn.color === "black" && row === 0){
        this.selectedPawn.isQueen = true;
    }

     if (wasCapture && this.canCaptureMore(this.selectedPawn)) {
        console.log("Możesz wykonać kolejne bicie tym samym pionkiem!");
        // NIE zmieniamy tury, pionek zostaje wybrany
    }else{
    this.selectedPawn.selected = false;

    this.turn = (this.turn === "white") ? "black" : "white";
    this.selectedPawn = null;   }

}


}


