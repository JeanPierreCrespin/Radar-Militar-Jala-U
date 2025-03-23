import { Routes } from '@angular/router';
import { RadarMilitarComponent } from '../core/radar-militar/radar-militar.component';
import {Nivel2Component} from '../core/nivel2/nivel2.component';

export const routes: Routes = [
  { path: '', redirectTo: 'radar/1', pathMatch: 'full' }, // 👈 Redirige la raíz a nivel2/1
  { path:'radar/:level',component:RadarMilitarComponent },
];
