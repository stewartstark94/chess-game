import { Piece } from "./pieces/piece";
import { Colour, Coords, FENChar, SafeSquares } from "./models";
import { Rook } from "./pieces/rook";
import { Knight } from "./pieces/knight";
import { Bishop } from "./pieces/bishop";
import { Queen } from "./pieces/queen";
import { King } from "./pieces/king";
import { Pawn } from "./pieces/pawn";

export class ChessBoard{
    private chessBoard: (Piece|null)[][];
    private readonly chessBoardSize: number = 8;
    private _playerColour: Colour = Colour.White;
    private _safeSquares: SafeSquares;

    constructor(){
        this.chessBoard = [
            [
                new Rook(Colour.White), new Knight(Colour.White), new Bishop(Colour.White), new Queen(Colour.White),
                new King(Colour.White), new Bishop(Colour.White), new Knight(Colour.White), new Rook(Colour.White)
            ],
            [
                new Pawn(Colour.White), new Pawn(Colour.White), new Pawn(Colour.White), new Pawn(Colour.White),
                new Pawn(Colour.White), new Pawn(Colour.White), new Pawn(Colour.White), new Pawn(Colour.White)
            ],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [
                new Pawn(Colour.Black), new Pawn(Colour.Black), new Pawn(Colour.Black), new Pawn(Colour.Black),
                new Pawn(Colour.Black), new Pawn(Colour.Black), new Pawn(Colour.Black), new Pawn(Colour.Black)
            ],
            [
                new Rook(Colour.Black), new Knight(Colour.Black), new Bishop(Colour.Black), new Queen(Colour.Black),
                new King(Colour.Black), new Bishop(Colour.Black), new Knight(Colour.Black), new Rook(Colour.Black)
            ],
        ];
        this._safeSquares = this.findSafeSquares();
    }

    public get playerColour(): Colour {
        return this._playerColour;
    }

    public get chessBoardView(): (FENChar|null)[][]{
        return this.chessBoard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        })
    }

    public get safeSquares(): SafeSquares {
        return this._safeSquares;
    }

    public static isSquareDark(x: number, y: number): boolean{
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }

    private areCoordsValid(x: number, y: number): boolean {
        return x >= 0 && x < this.chessBoardSize && y >= 0 && y < this.chessBoardSize;
    }

    public isInCheck(playerColour: Colour): boolean {
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || piece.colour === playerColour) continue;

                for(const {x: dx, y: dy} of piece.directions){
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if(!this.areCoordsValid(newX, newY)) continue;

                    if(piece instanceof Pawn|| piece instanceof Knight || piece instanceof King){
                        //pawns only attack diagonally
                        if(piece instanceof Pawn && dy === 0) continue;
                        const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                        if(attackedPiece instanceof King && attackedPiece.colour === playerColour){
                            return true;
                        }
                        else {
                            while(this.areCoordsValid(newX, newY)){
                                const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                                if(attackedPiece instanceof King && attackedPiece.colour === playerColour){
                                    return true;
                                }
                                if(attackedPiece !== null) break; //blocked by another piece
                               
                                newX += dx;
                                newY += dy;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    private isPositionSafeAfterMove(piece:Piece, prevX: number, prevY: number, newX: number, newY: number): boolean{
        const newPiece: Piece | null = this.chessBoard[newX][newY];
        if(newPiece && newPiece.colour === piece.colour) return false; //cannot capture own piece
        
        //check position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.colour);

        //restore position 
        this.chessBoard[prevX][prevY] = piece;
        this.chessBoard[newX][newY] = newPiece;

        return isPositionSafe;
    }

    private findSafeSquares(): SafeSquares{
        const safeSquares: SafeSquares = new Map<string, Coords[]>();

        for(let x = 0; x < this.chessBoardSize; x++) {
            for(let y = 0; y < this.chessBoardSize; y++) {
                const piece:Piece | null = this.chessBoard[x][y];
                if(!piece || piece.colour !== this._playerColour) continue;

                const pieceSafeSquares: Coords[] = [];

                for(const {x: dx, y: dy} of piece.directions){
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if(!this.areCoordsValid(newX, newY)) continue;

                    let newPiece: Piece|null = this.chessBoard[newX][newY];
                    if(newPiece && newPiece.colour === piece.colour) continue;


                    //restrict pawn movements
                    if(piece instanceof Pawn) {
                        //cant move pawn forward 2 if blocked
                        if(dx === 2 || dx === -2){
                            if(newPiece) continue;
                            if(this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
                    }

                    //cant move pawn 1 forward if blocked
                    if((dx === 1 || dx === -1) && dy === 0 && newPiece) continue;

                    //cant move pawn diagonally if no opponent, or own piece blocking
                    if((dy === 1 || dy === -1) && (!newPiece || piece.colour === newPiece.colour)) continue;

                }
                    if(piece instanceof Pawn || piece instanceof Knight || piece instanceof King){
                        if(this.isPositionSafeAfterMove(piece, x, y, newX, newY))
                            pieceSafeSquares.push({x: newX, y: newY});
                    }
                    else {
                        while(this.areCoordsValid(newX, newY)){
                            newPiece = this.chessBoard[newX][newY];
                            if(newPiece && newPiece.colour === piece.colour) break;

                            if(this.isPositionSafeAfterMove(piece, x, y, newX, newY))
                            pieceSafeSquares.push({x: newX, y: newY});

                            if(newPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }

                if(pieceSafeSquares.length)
                    safeSquares.set(x + "," + y, pieceSafeSquares);
            }
        }

        return safeSquares;
    }
}
    


                    