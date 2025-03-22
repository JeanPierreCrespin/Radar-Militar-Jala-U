import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-radar-militar',
  imports: [CommonModule],
  templateUrl: './radar-militar.component.html',
  styleUrl: './radar-militar.component.scss',
})
export class RadarMilitarComponent {
  rotation = 0;
  scanSpeed = 80;
  matrixSize = 100; // Define el tamaño de la matriz
  radarLines: { angle: number; x2: number; y2: number }[] = [];
  intervalId: any;

  dataButtons = [
    {
      name: 'n+1',
    },
    {
      name: 'n+2',
    },
    {
      name: '3n+1',
    },
  ];

  dataEnemys: { x: number; y: number }[] = [];

  ngOnInit() {
    this.startRadar();
    this.generateInitialPoints();
    this.updateEnemyPositions();
    this.generateRadarLines();
  }

  startRadar() {
    setInterval(() => {
      this.rotation = (this.rotation + 2) % 360;
    }, this.scanSpeed);
  }

  onValidation(selectedPattern: string) {
    const isValid = this.validatePattern(selectedPattern);
    if (isValid) {
      alert('¡Has ganado! Patrón correcto.');
    } else {
      alert('Patrón incorrecto. Inténtalo de nuevo.');
    }
  }

  validatePattern(selectedPattern: string): boolean {
    // Implementa la lógica de validación del patrón aquí
    // Por ejemplo, puedes comparar el patrón seleccionado con un patrón esperado
    const expectedPattern = 'n+1'; // Cambia esto según tu lógica
    return selectedPattern === expectedPattern;
  }

  generateInitialPoints() {
    const numEnemies = Math.floor(Math.random() * 5) + 1;
    this.dataEnemys = Array.from({ length: numEnemies }, () => {
      const x = Math.floor(Math.random() * this.matrixSize);
      const y = Math.floor(Math.random() * this.matrixSize);
      return { x, y };
    });
  }

  updateEnemyPositions() {
    this.intervalId = setInterval(() => {
      this.dataEnemys = this.dataEnemys.map((enemy) => {
        const newX = Math.max(
          0,
          Math.min(
            this.matrixSize,
            Math.floor(enemy.x - (enemy.x - this.matrixSize / 2) * 0.1)
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            this.matrixSize,
            Math.floor(enemy.y - (enemy.y - this.matrixSize / 2) * 0.1)
          )
        );
        return { x: newX, y: newY };
      });

      const hasLost = this.dataEnemys.some(
        (enemy) =>
          enemy.x === this.matrixSize / 2 && enemy.y === this.matrixSize / 2
      );
      if (hasLost) {
        alert('¡Has perdido! Un enemigo ha llegado al centro.');
        clearInterval(this.intervalId);
        this.startRadar();
        this.generateInitialPoints();
        this.updateEnemyPositions();
        this.generateRadarLines();
      }
    }, 2000); // Movimiento cada 2 segundos
  }

  generateRadarLines() {
    const centerX = 50;
    const centerY = 50;
    const radius = 50;

    this.radarLines = [];

    for (let i = 0; i < 360; i += 30) {
      const angleRad = (i * Math.PI) / 180;
      this.radarLines.push({
        angle: i,
        x2: centerX + radius * Math.cos(angleRad),
        y2: centerY + radius * Math.sin(angleRad),
      });
    }
  }
}
