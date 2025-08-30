import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.css',
  standalone: true
})
export class NavMenu {

}
