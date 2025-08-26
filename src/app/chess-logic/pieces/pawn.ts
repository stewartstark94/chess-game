import { FENChar, Coords, Colour } from "../models";
import { Piece } from "./piece";

export class Pawn extends Piece{
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 1 },
        { x: -1, y: 1 }
    ];

    constructor(private pieceColour:Colour){
        super(pieceColour);
        if (pieceColour === Colour.Black) this.setBlackPawnDirections();
        this._FENChar = pieceColour === Colour.White ? FENChar.WhitePawn : FENChar.BlackPawn;
    }

    private setBlackPawnDirections(): void {
        this._directions = this._directions.map(({x,y}) => ({x: -1*x, y: y}));
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(_) {
        this._hasMoved = true;
        this._directions = [
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 1 },
            { x: -1, y: 1 } 
        ];
        if (this.pieceColour === Colour.Black) this.setBlackPawnDirections();
    }
}