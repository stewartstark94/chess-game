import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessBoard } from './modules/chess-board/chess-board';
import { NavMenu } from './modules/nav-menu/nav-menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChessBoard, NavMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chess-game');
}
