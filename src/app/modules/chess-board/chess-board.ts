import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckState, Colour, Coords, FENChar, LastMove, pieceImgPaths, SafeSquares } from '../../chess-logic/models';
import { ChessBoard as ChessBoardLogic } from '../../chess-logic/chess-board';  
import { SelectedSquare } from './models';

@Component({
  selector: 'app-chess-board',
  imports: [CommonModule],
  templateUrl: './chess-board.html',
  styleUrls: ['./chess-board.css']
})
export class ChessBoard {
  public pieceImgPaths = pieceImgPaths;

  private chessBoard = new ChessBoardLogic();
  public chessBoardView: (FENChar|null)[][] = this.chessBoard.chessBoardView;
  public get playerColour(): Colour{return this.chessBoard.playerColour;};
  public get safeSquares(): SafeSquares{return this.chessBoard.safeSquares;};
  public get gameOverMessage(): string | undefined { return this.chessBoard.GameOverMessage; };

  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  //promotion properties
  public isPromotionActive: boolean = false;
  public promotionCoords: Coords | null = null;
  private promotedPiece: FENChar | null = null;
  public promotionPieces(): FENChar[]{
    return this.playerColour === Colour.White ?
    [FENChar.WhiteQueen, FENChar.WhiteRook, FENChar.WhiteBishop, FENChar.WhiteKnight] :
    [FENChar.BlackQueen, FENChar.BlackRook, FENChar.BlackBishop, FENChar.BlackKnight];
  }


  public flipMode: boolean = false;

  public flipBoard(): void {
    this.flipMode = !this.flipMode;
  }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoardLogic.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if(!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y);
  }

  public isSquareLastMove(x: number, y: number): boolean {
    if(!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return prevX === x && prevY === y || currX === x && currY === y;
  }

  public isSquareInCheck(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquarePromotionSquare(x: number, y: number): boolean {
    if(!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  private unmarkingPreviouslySelectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];

    if(this.isPromotionActive){
      this.isPromotionActive = false;
      this.promotedPiece = null;
      this.promotionCoords = null;
    }
  }

  public selectingPiece(x: number, y: number): void{
    if(this.gameOverMessage !== undefined) return;
    const piece: FENChar | null = this.chessBoardView[x][y];
    if(!piece) return;
    if(this.isWrongPieceSelected(piece)) return;

    const isSameSquareClicked: boolean = !!this.selectedSquare.piece && this.selectedSquare.x === x && this.selectedSquare.y === y;
    this.unmarkingPreviouslySelectedAndSafeSquares();
    if(isSameSquareClicked) return ;
    this.selectedSquare = {piece, x, y};
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private placingPiece(newX:number, newY:number): void {
    if (!this.selectedSquare.piece) return;
    if (!this.isSquareSafeForSelectedPiece(newX, newY)) return;

    //pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn;
    const isPawnOnLastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const openPromotionDialog: boolean = !this.isPromotionActive && isPawnOnLastRank;

    if(openPromotionDialog){
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY };
      //wait for player to choose promotion piece
      return;
    }

    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY);
  }

  private updateBoard(prevX: number, prevY: number, newX: number, newY: number): void{
    this.chessBoard.move(prevX, prevY, newX, newY, this.promotedPiece);
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.checkState = this.chessBoard.checkState;
    this.lastMove = this.chessBoard.lastMove;
    this.unmarkingPreviouslySelectedAndSafeSquares();
  }

  public promotePiece(piece:FENChar): void{
    if(!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece = piece;
    const {x: newX, y: newY} = this.promotionCoords;
    const {x: prevX, y: prevY} = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY);
  }

  public closePawnPromotionDialog(): void{
    this.unmarkingPreviouslySelectedAndSafeSquares();
  }

  public move(x: number, y: number): void{
    this.selectingPiece (x, y);
    this.placingPiece (x, y);
  }

  private isWrongPieceSelected(piece:FENChar): boolean{
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColour === Colour.Black ||
     !isWhitePieceSelected && this.playerColour === Colour.White;
  }
}
