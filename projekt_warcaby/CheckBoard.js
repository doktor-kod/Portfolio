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
    //w jednej tablicy
    const allPawns = [...this.pawnsWhite, ...this.pawnsBlack];
    //ustalenie ktory jest klikniety
    const clickedPawn = allPawns.find(p => p.row === row && p.col === col);
    //uniemozliwiam odkliknięcie innego
    if (clickedPawn && this.selectedPawn && clickedPawn !== this.selectedPawn) return;

    if (clickedPawn) {
        //sprawdzenie tury
        if (clickedPawn.color !== this.turn) return;
        //ustawienie selekcji
        if (this.selectedPawn) this.selectedPawn.selected = false;
        this.selectedPawn = clickedPawn;
        clickedPawn.selected = true;
    } else if (this.selectedPawn) { //ruch ustalenie roznicy miedzy  kliknietym pionkiem a polem
        const rowDiff = row - this.selectedPawn.row;
        const colDiff = col - this.selectedPawn.col;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);

        // zapewnienie ze pole jest po skosie i pole jest na pewno czarne
        if (absRowDiff !== absColDiff || (row + col) % 2 === 0) return;
        //czy idziemy w prawp/lewo góra/dół
        const rowStep = rowDiff > 0 ? 1 : -1;
        const colStep = colDiff > 0 ? 1 : -1;

        // Sprawdzanie co stoi na drodze po skosie 
        let pathPawns = [];
        //petla ktora sprawdza całą dostępną trasę po kolei i dodaje pionki do tablicy pionków na tej trasie
        for (let i = 1; i < absRowDiff; i++) {
            const checkRow = this.selectedPawn.row + i * rowStep;
            const checkCol = this.selectedPawn.col + i * colStep;
            const p = allPawns.find(p => p.row === checkRow && p.col === checkCol);
            if (p) pathPawns.push(p);
        }
        //jezeli zaznaczony to damka
        if (this.selectedPawn.isQueen) {
            // LOGIKA DAMKI
            //jezeli nie ma nic po drodze to dowolnie daleko moze isc
            if (pathPawns.length === 0) {
                // Ruch wolny (dowolna ilość pól)
                this.moveSelectedPawn(row, col);
                //jezeli za to jest po drodze to 1 staje sie ofiara i go usuwamy a pionek moze sie ruszyc i ruszac dalej w lancuchu zbicia
            } else if (pathPawns.length === 1 && pathPawns[0].color !== this.selectedPawn.color) {
                // Bicie (tylko 1 przeciwnik na drodze)
                const victim = pathPawns[0];
                this.pawnsWhite = this.pawnsWhite.filter(p => p !== victim);
                this.pawnsBlack = this.pawnsBlack.filter(p => p !== victim);
                this.moveSelectedPawn(row, col, true);
            }
        } else {
            // LOGIKA ZWYKŁEGO PIONKA
            //ustala poprawny kierunek ruchu
            const isCorrectDir = (this.selectedPawn.color === "white") ? rowDiff === 1 : rowDiff === -1;
            //zwykły ruch tylko o 1 i w dobrym kierunku
            if (absRowDiff === 1 && isCorrectDir) {
                this.moveSelectedPawn(row, col);
                //ruch przy zbiciu usunięcie środkowego piona jezeli to pion przeciwnika
            } else if (absRowDiff === 2) {
                const midPawn = pathPawns[0];
                if (midPawn && midPawn.color !== this.selectedPawn.color) {
                    this.pawnsWhite = this.pawnsWhite.filter(p => p !== midPawn);
                    this.pawnsBlack = this.pawnsBlack.filter(p => p !== midPawn);
                    //umozliwienie lancucha zbic

                    this.moveSelectedPawn(row, col, true);
                }
            }
        }
    }
}

canCaptureMore = (pawn) => {
    const allPawns = [...this.pawnsWhite, ...this.pawnsBlack];
    //mozliwe kierunki
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    return directions.some(([dr, dc]) => {
        if (pawn.isQueen) {
            // Damka szuka przeciwnika w dowolnej odległości na linii
            for (let dist = 1; dist < 7; dist++) {
                const midR = pawn.row + dist * dr;
                const midC = pawn.col + dist * dc;
                
                if (midR < 0 || midR > 7 || midC < 0 || midC > 7) break;

                const midPawn = allPawns.find(p => p.row === midR && p.col === midC);
                if (midPawn) {
                    if (midPawn.color === pawn.color) break; // Zablokowane przez własny pionek
                    
                    // Znaleziono przeciwnika - sprawdź czy pole za nim jest wolne
                    const nextR = midR + dr;
                    const nextC = midC + dc;
                    if (nextR < 0 || nextR > 7 || nextC < 0 || nextC > 7) break;
                    
                    const isNextEmpty = !allPawns.find(p => p.row === nextR && p.col === nextC);
                    return isNextEmpty;
                }
            }
        } else {
            // Standardowe bicie dla pionka (zasięg 2)
            const tr = pawn.row + dr * 2;
            const tc = pawn.col + dc * 2;
            const mr = pawn.row + dr;
            const mc = pawn.col + dc;

            if (tr >= 0 && tr <= 7 && tc >= 0 && tc <= 7) {
                const midPawn = allPawns.find(p => p.row === mr && p.col === mc);
                const targetEmpty = !allPawns.find(p => p.row === tr && p.col === tc);
                if (midPawn && midPawn.color !== pawn.color && targetEmpty) return true;
            }
        }
        return false;
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
//row = docelowy rządm col docelowa kolumna, wasCapture czy moze po zbiciu dalej sie ruszac - łańcuch zbic
moveSelectedPawn = (row, col, wasCapture = false) => {
    this.selectedPawn.row = row;
    this.selectedPawn.col = col;
    //promocja na damkę
    if(this.selectedPawn.color === "white" && row === 7){
        this.selectedPawn.isQueen = true;
    }
        if(this.selectedPawn.color === "black" && row === 0){
        this.selectedPawn.isQueen = true;
    }
    //jezeli dalej jest mozliwe bicie dopuszczamy go
     if (wasCapture && this.canCaptureMore(this.selectedPawn)) {
        console.log("Możesz wykonać kolejne bicie tym samym pionkiem!");
        // NIE zmieniamy tury, pionek zostaje wybrany
    }else{
    this.selectedPawn.selected = false;
        //zmiana tury, wyczyszczenie selectów
    this.turn = (this.turn === "white") ? "black" : "white";
    this.selectedPawn = null;   }

}


}


