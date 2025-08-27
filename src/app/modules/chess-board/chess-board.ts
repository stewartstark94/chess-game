import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Colour, FENChar } from '../../chess-logic/models';
import { ChessBoard as ChessBoardLogic } from '../../chess-logic/chess-board';  

@Component({
  selector: 'app-chess-board',
  imports: [CommonModule],
  templateUrl: './chess-board.html',
  styleUrl: './chess-board.css'
})
export class ChessBoard {
  private chessBoard = new ChessBoardLogic();
  public chessBoardView: (FENChar|null)[][] = this.chessBoard.chessBoardView;
  public get playerColour(): Colour{return this.chessBoard.playerColour;};

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoardLogic.isSquareDark(x, y);
  }
}
