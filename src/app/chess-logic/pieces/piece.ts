import { Colour, Coords, FENChar } from "../models";

export abstract class Piece{
    protected abstract _FENChar: FENChar;
    protected abstract _directions: Coords[];

    constructor(private _colour: Colour) {}

    public get FENChar(): FENChar{
        return this._FENChar;
    }

    public get directions(): Coords[]{
    return this._directions;
    }   

    public get colour(): Colour{
        return this._colour;
    }
}