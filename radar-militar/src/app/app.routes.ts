import { Routes } from '@angular/router';
import { RadarMilitarComponent } from '../core/radar-militar/radar-militar.component';
import { EquipoProyectoComponent } from '../core/equipo-proyecto/equipo-proyecto.component';

export const routes: Routes = [
  { path: '', redirectTo: 'radar/1', pathMatch: 'full' }, // 👈 Redirige la raíz a nivel2/1
  { path:'radar/:level',component:RadarMilitarComponent },
  { path:'equipo-proyecto', component: EquipoProyectoComponent }
];
