import { Piece } from "./pieces/piece";

export enum Colour{
    White,
    Black
}

export type Coords = {
    x: number;
    y: number;
}

export enum FENChar{
    WhitePawn='P',
    WhiteRook='R',
    WhiteKnight='N',
    WhiteBishop='B',
    WhiteQueen='Q',
    WhiteKing='K',
    BlackPawn='p',
    BlackRook='r',
    BlackKnight='n',
    BlackBishop='b',
    BlackQueen='q',
    BlackKing='k'
}

export const pieceImgPaths: Readonly<Record<FENChar, string>> ={
    [FENChar.WhitePawn]: "assets/pieces/white-pawn.svg",
    [FENChar.WhiteRook]: "assets/pieces/white-rook.svg",
    [FENChar.WhiteKnight]: "assets/pieces/white-knight.svg",
    [FENChar.WhiteBishop]: "assets/pieces/white-bishop.svg",
    [FENChar.WhiteQueen]: "assets/pieces/white-queen.svg",
    [FENChar.WhiteKing]: "assets/pieces/white-king.svg",
    [FENChar.BlackPawn]: "assets/pieces/black-pawn.svg",
    [FENChar.BlackRook]: "assets/pieces/black-rook.svg",
    [FENChar.BlackKnight]: "assets/pieces/black-knight.svg",
    [FENChar.BlackBishop]: "assets/pieces/black-bishop.svg",
    [FENChar.BlackQueen]: "assets/pieces/black-queen.svg",
    [FENChar.BlackKing]: "assets/pieces/black-king.svg"
}

export type SafeSquares = Map<string, Coords []>;

export type LastMove = {
    piece: Piece;
    prevX: number;
    prevY: number;
    currX: number;
    currY: number;
}

type KingInCheck ={
    isInCheck: true;
    x: number;
    y: number;
}

type KingNotInCheck = {
    isInCheck: false;
}

export type CheckState = KingInCheck | KingNotInCheck;