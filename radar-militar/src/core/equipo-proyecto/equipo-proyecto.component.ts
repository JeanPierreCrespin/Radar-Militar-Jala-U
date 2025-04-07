import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-equipo-proyecto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './equipo-proyecto.component.html',
  styleUrls: ['./equipo-proyecto.component.scss']
})
export class EquipoProyectoComponent {
  desarrolladores = [
    {
      nombre: 'Jean Pierre Crespin Huaman',
      sis: 'STU-943.ARG-C5',
      correo: 'Pierre.Crespin0125@jala.university',
      pais: 'Argentina',
      rol: 'Estudiante en Jala University',
      avatar: 'JC'
    },
    {
      nombre: 'Lucia Angeles Candia',
      sis: 'STU-1044.ARG.C5',
      correo: 'Lucia.Candia.0125@jala.university',
      pais: 'Argentina',
      rol: 'Estudiante en Jala University',
      avatar: 'LC'
    },
    {
      nombre: 'Jaider Ramirez Nova',
      sis: 'STU-1102.COL.C5',
      correo: 'Jaider.Ramirez0125@jala.university',
      pais: 'Colombia',
      rol: 'Estudiante en Jala University',
      avatar: 'JR'
    },
    {
      nombre: 'Sebastian Eduardo Gomez Forero',
      sis: 'STU-1089.COL.C5',
      correo: 'Sebastian.gomez1025@jala.university',
      pais: 'Colombia',
      rol: 'Estudiante en Jala University',
      avatar: 'SG'
    }
  ];
}
