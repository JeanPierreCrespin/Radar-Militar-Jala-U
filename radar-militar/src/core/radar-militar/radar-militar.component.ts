import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'app-radar-militar',
  imports: [CommonModule],
  templateUrl: './radar-militar.component.html',
  styleUrl: './radar-militar.component.scss'
})
export class RadarMilitarComponent{
  rotation = 0;
  scanSpeed = 80; 
  points: { x: number; y: number }[] = [];
  radarLines: { angle: number; x2: number; y2: number }[] = [];

  ngOnInit() {
    this.startRadar();
    this.generatePoints();
    this.generateRadarLines();
  }

  startRadar() {
    setInterval(() => {
      this.rotation = (this.rotation + 2) % 360; // Movimiento más suave
    }, this.scanSpeed);
  }

  generatePoints() {
    setInterval(() => {
      this.points = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, () => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 50;
        return {
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        };
      });
    }, 4000); // Generación más espaciada para mayor realismo
  }

  generateRadarLines() {
    const centerX = 50;
    const centerY = 50;
    const radius = 50; // Longitud de las líneas hasta el borde
  
    this.radarLines = [];
  
    for (let i = 0; i < 360; i += 30) {
      const angleRad = (i * Math.PI) / 180;
      this.radarLines.push({
        angle: i,
        x2: centerX + radius * Math.cos(angleRad),
        y2: centerY + radius * Math.sin(angleRad)
      });
    }
  }
  
  
}
