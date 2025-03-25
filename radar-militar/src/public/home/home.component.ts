import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public partOfGame: 'home' | 'gameOver' | 'winner';
  constructor(private router:Router) {
    this.partOfGame = 'home';
   }
  public gameStart(){
    this.router.navigate(['/radar']);
  }

}
