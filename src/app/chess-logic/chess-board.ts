import { Piece } from "./pieces/piece";
import { CheckState, Colour, Coords, FENChar, LastMove, SafeSquares } from "./models";
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
    private _lastMove: LastMove|undefined;
    private _checkState: CheckState = { isInCheck: false };

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

    public get lastMove(): LastMove| undefined {
        return this._lastMove;
    }

    public get checkState(): CheckState {
        return this._checkState;
    }

    public static isSquareDark(x: number, y: number): boolean{
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }

    private areCoordsValid(x: number, y: number): boolean {
        return x >= 0 && x < this.chessBoardSize && y >= 0 && y < this.chessBoardSize;
    }

    public isInCheck(playerColour: Colour, checkingCurrentPosition: boolean): boolean {
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
                            if(checkingCurrentPosition) this._checkState = { isInCheck: true, x: newX, y: newY };
                                return true;
                        }
                        else {
                            while(this.areCoordsValid(newX, newY)){
                                const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                                if(attackedPiece instanceof King && attackedPiece.colour === playerColour){
                                    if(checkingCurrentPosition) this._checkState = { isInCheck: true, x: newX, y: newY };
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
        if(checkingCurrentPosition) this._checkState = { isInCheck: false };
        return false;
    }

    private isPositionSafeAfterMove(piece:Piece, prevX: number, prevY: number, newX: number, newY: number): boolean{
        const newPiece: Piece | null = this.chessBoard[newX][newY];
        if(newPiece && newPiece.colour === piece.colour) return false; //cannot capture own piece
        
        //check position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.colour, false);

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

                if(piece instanceof King){
                    if(this.canCastle(piece, true))
                        pieceSafeSquares.push({x, y: 6});
                    if(this.canCastle(piece, false))
                        pieceSafeSquares.push({x, y: 2});
                }
                else if(piece instanceof Pawn && this.canCaptureEnPassant(piece, x, y))
                    pieceSafeSquares.push({x: x + (piece.colour === Colour.White ? 1 : -1), y: this._lastMove!.prevY});

                if(pieceSafeSquares.length)
                    safeSquares.set(x + "," + y, pieceSafeSquares);
            }
        }

        return safeSquares;
    }

    private canCaptureEnPassant(pawn: Pawn, pawnX: number, pawnY: number): boolean{
    if (!this._lastMove) return false;
    const { piece, prevX, prevY, currX, currY } = this._lastMove;
    // Only possible if last move was a pawn moving two squares
    if (!(piece instanceof Pawn)) return false;
    if (Math.abs(currX - prevX) !== 2) return false;
    // The capturing pawn must be on the same rank as the pawn that moved, and adjacent file
    if (pawnX !== currX) return false; // Must be on the same rank as the pawn that moved
    if (Math.abs(pawnY - currY) !== 1) return false; // Must be adjacent file
    // The pawn to be captured must be of the opposite colour
    if (piece.colour === pawn.colour) return false;

    // The capturing pawn must be on the correct rank (4th for white, 3rd for black)
    if ((pawn.colour === Colour.White && pawnX !== 4) || (pawn.colour === Colour.Black && pawnX !== 3)) return false;

    // Simulate the en passant move and check if it is safe
    const pawnNewPositionX: number = pawnX + (pawn.colour === Colour.White ? 1 : -1);
    const pawnNewPositionY: number = currY;

    // Temporarily remove the captured pawn
    const capturedPawn = this.chessBoard[currX][currY];
    this.chessBoard[currX][currY] = null;
    const isPositionSafe: boolean = this.isPositionSafeAfterMove(pawn, pawnX, pawnY, pawnNewPositionX, pawnNewPositionY);
    this.chessBoard[currX][currY] = capturedPawn;

    return isPositionSafe;
    }

    private canCastle(king: King, kingSideCastle: boolean): boolean{
        if(king.hasMoved) return false;

        const kingPositionX: number = king.colour === Colour.White ? 0 : 7;
        const kingPositionY: number = 4;
        const rookPositionX: number = kingPositionX;
        const rookPositionY: number = kingSideCastle ? 7 : 0;
        const rook: Piece | null = this.chessBoard[rookPositionX][rookPositionY];

        if(!(rook instanceof Rook) || rook.hasMoved || this._checkState.isInCheck) return false;

        const firstNextKingPositionY: number = kingPositionY + (kingSideCastle ? 1 : -1);    
        const secondNextKingPositionY: number = kingPositionY + (kingSideCastle ? 2 : -2);
 
        if(this.chessBoard[kingPositionX][firstNextKingPositionY] || this.chessBoard[kingPositionX][secondNextKingPositionY]) return false;

        if(!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return this.isPositionSafeAfterMove(king, kingPositionX, kingPositionY, kingPositionX, firstNextKingPositionY) &&
         this.isPositionSafeAfterMove(king, kingPositionX, kingPositionY, kingPositionX, secondNextKingPositionY);
    }

    public move(prevX: number, prevY: number, newX: number, newY: number): void{
        if(!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(newX, newY)) return;
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if(!piece || piece.colour !== this._playerColour) return;

        const pieceSafeSquares: Coords[] | undefined = this.safeSquares.get(prevX + "," + prevY);
        if(!pieceSafeSquares || !pieceSafeSquares.find(coords => coords.x === newX && coords.y === newY))
            throw new Error("Square is not safe.");

        if((piece instanceof Pawn || piece instanceof King || piece instanceof Rook) && !piece.hasMoved)
            piece.hasMoved = true;
        
        this.handlingSpecialMoves(piece, prevX, prevY, newX, newY);
            //update board
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        this._lastMove = {
            piece,
            prevX,
            prevY,
            currX: newX,
            currY: newY
        };

        this._playerColour = this._playerColour === Colour.White ? Colour.Black : Colour.White;
        this.isInCheck(this._playerColour, true);
        this._safeSquares = this.findSafeSquares();
        
    }

    private handlingSpecialMoves (piece: Piece, prevX: number, prevY: number, newX: number, newY: number): void{
        if(piece instanceof King && Math.abs(newY - prevY) === 2){

            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;
            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;
            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;

        }
        else if(
        piece instanceof Pawn &&
        this._lastMove &&
        this._lastMove.piece instanceof Pawn &&
        Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 &&
        prevX === this._lastMove.currX &&
        newY === this._lastMove.currY
        ){
            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
        }
    }
}
