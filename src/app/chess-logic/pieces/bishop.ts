import { FENChar, Coords, Colour } from "../models";
import { Piece } from "./piece";

export class Bishop extends Piece{
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
    ];

    constructor(private pieceColour:Colour){
        super(pieceColour);
        this._FENChar = pieceColour === Colour.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
    }
}