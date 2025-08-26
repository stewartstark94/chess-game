import { FENChar, Coords, Colour } from "../models";
import { Piece } from "./piece";

export class Knight extends Piece{
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 2, y: 1 },
        { x:-2, y: 1 },
        { x: 2, y: -1 },
        { x: -2, y: -1 },
        { x: 1, y: 2 },
        { x: -1, y: 2 },
        { x: 1, y: -2 },
        { x: -1, y: -2 }
    ];

    constructor(private pieceColour:Colour){
        super(pieceColour);
        this._FENChar = pieceColour === Colour.White ? FENChar.WhiteKnight : FENChar.BlackKnight;
    }
}