import { FENChar, Coords, Colour } from "../models";
import { Piece } from "./piece";

export class Rook extends Piece{
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 }
    ];

    constructor(private pieceColour:Colour){
        super(pieceColour);
        this._FENChar = pieceColour === Colour.White ? FENChar.WhiteRook : FENChar.BlackRook;
    }

    public get hasMoved(): boolean{
        return this._hasMoved;
    }

    public set hasMoved(_){
        this._hasMoved = true;
    }
}