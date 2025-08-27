import { Piece } from "./pieces/piece";
import { Colour, FENChar } from "./models";
import { Rook } from "./pieces/rook";
import { Knight } from "./pieces/knight";
import { Bishop } from "./pieces/bishop";
import { Queen } from "./pieces/queen";
import { King } from "./pieces/king";
import { Pawn } from "./pieces/pawn";

export class ChessBoard{
    private chessBoard: (Piece|null)[][];
    private _playerColour: Colour = Colour.White;

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
            
        ]
    }

    public get playerColour(): Colour {
        return this._playerColour;
    }

    public get chessBoardView(): (FENChar|null)[][]{
        return this.chessBoard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        })
    }

    public static isSquareDark(x: number, y: number): boolean{
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }
}