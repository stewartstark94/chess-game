import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Colour, Coords, FENChar, pieceImgPaths, SafeSquares } from '../../chess-logic/models';
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
  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];

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

  public selectingPiece(x: number, y: number): void{
    const piece: FENChar | null = this.chessBoardView[x][y];
    if(!piece) return;
    
    this.selectedSquare = {piece, x, y};
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }
}
