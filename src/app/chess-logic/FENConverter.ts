import { columns } from "../modules/chess-board/models";
import { Colour, LastMove } from "./models";
import { King } from "./pieces/king";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";

export class FENConverter {

    public convertBoardToFEN(
        board: (Piece|null)[][],
        playerColour: Colour,
        lastMove: LastMove | undefined,
        fiftyMoveRuleCounter: number,
        fullNumberOfMoves: number
    ) : string{
        let FEN: string = "";

        for(let i = 7; i>= 0; i--){
            let FENRow: string = "";
            let consecutiveEmptySquaresCounter = 0;

            for(const piece of board[i]){
                if(!piece) {
                    consecutiveEmptySquaresCounter++;
                    continue;
                }

                if (consecutiveEmptySquaresCounter !== 0)
                    FENRow += String(consecutiveEmptySquaresCounter);

                consecutiveEmptySquaresCounter = 0;
                FENRow += piece.FENChar;
            }

            if(consecutiveEmptySquaresCounter !== 0)
                FENRow += String(consecutiveEmptySquaresCounter);

            FEN += (i === 0) ? FENRow : FENRow + "/";
        }

        const player: string = playerColour === Colour.White ? "w" : "b";
        FEN += " " + player;
        FEN += " " + this.castlingAvailability(board);
        FEN += " " + this.enPassantPossibility(lastMove, playerColour);
        FEN += " " + fiftyMoveRuleCounter * 2;
        FEN += " " + fullNumberOfMoves;
        return FEN;
    }

    private castlingAvailability(board: (Piece | null)[][]): string {
        const castlingPossibilities = (colour: Colour): string => {
            let castlingAvailability: string = "";

            const kingPositionX: number = colour === Colour.White ? 0 : 7;
            const king: Piece | null = board[kingPositionX][4];

            if (king instanceof King && !king.hasMoved) {
                const rookPositionX: number = kingPositionX;
                const kingSideRook = board[rookPositionX][7];
                const queenSideRook = board[rookPositionX][0];

                if(queenSideRook instanceof Rook && !queenSideRook.hasMoved)
                    castlingAvailability += "q";

                if(colour === Colour.White)
                    castlingAvailability = castlingAvailability.toUpperCase();
            }

            return castlingAvailability;
        }

        const castlingAvailability: string = castlingPossibilities(Colour.White) + castlingPossibilities(Colour.Black);
        return castlingAvailability !== "" ? castlingAvailability : "-";
    }

    private enPassantPossibility(lastMove: LastMove | undefined, colour: Colour): string {
        if (!lastMove) return "-";
        const { piece, currX: newX, currY: newY, prevX, prevY } = lastMove;

        if( piece instanceof Pawn && Math.abs(newX - prevX) === 2){
            const row: number = colour ===Colour.White ? 6 : 3;
            return columns[prevY] + String(row);
        }
        return "-";
    }
}