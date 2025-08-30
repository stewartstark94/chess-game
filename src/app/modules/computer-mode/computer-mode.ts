import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChessBoard } from '../chess-board/chess-board';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Subscription } from 'rxjs';
import { Stockfish } from './stockfish';
import { ChessBoardService } from '../chess-board/chess-board.service';

@Component({
  selector: 'app-computer-mode',
  imports: [CommonModule],
  templateUrl: '../chess-board/chess-board.html',
  styleUrls: ['../chess-board/chess-board.css']
})
export class ComputerMode extends ChessBoard implements OnInit, OnDestroy {
  private subscriptions$ = new Subscription();

  constructor(private StockfishService: Stockfish) {
    super(inject(ChessBoardService));
  }

  public ngOnInit(): void {
    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        const player: string = FEN.split(' ')[1];
        if(player === 'w') return;

        try {
          console.log('Calling Stockfish API with FEN:', FEN);
          const {prevX, prevY, newX, newY, promotedPiece} = await firstValueFrom(this.StockfishService.getBestMove(FEN));
          console.log('Stockfish move:', {prevX, prevY, newX, newY, promotedPiece});
          this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
        } catch (error) {
          console.error('Stockfish API error:', error);
        }
      }
    });
    this.subscriptions$.add(chessBoardStateSubscription$);
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

}
