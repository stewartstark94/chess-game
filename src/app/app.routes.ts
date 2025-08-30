import { Routes } from '@angular/router';
import { ChessBoard } from './modules/chess-board/chess-board';
import { ComputerMode } from './modules/computer-mode/computer-mode';

export const routes: Routes = [
    {
        path: 'against-friend',
        component: ChessBoard,
        title: 'Play Against Friend'
    },
    {
        path: 'against-computer',
        component: ComputerMode,
        title: 'Play Against Computer'
    }
];
