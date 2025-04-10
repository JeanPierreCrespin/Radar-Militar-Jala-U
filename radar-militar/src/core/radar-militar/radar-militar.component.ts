import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

interface DataButton {
  label: string;
  value: number;
}

@Component({
  selector: 'app-radar-militar',
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './radar-militar.component.html',
  styleUrl: './radar-militar.component.scss',
  standalone: true,
})
export class RadarMilitarComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  level: number = 1;
  rotation = 0;
  scanSpeed = 80;
  matrixSize = 100; // Define el tamaño de la matriz
  radarLines: { angle: number; x2: number; y2: number }[] = [];
  intervalId: any;

  dataButtons: DataButton[] = [];

  options: { [key: number]: DataButton[] } = {
    1: [
      { label: 'x(n) = x0 - n * speed\n' + 'y(n) = y0 - n * speed\n', value: 1 },
      { label: 'n+2', value: 2 },
      { label: '3n+1', value: 3 },
    ],
    2: [
      { label: 'n + 1', value: 1 },
      { label: 'n+2', value: 2 },
      { label: 'radius(n) = radius0 - n * speed\n' + 'angle(n) = angle0 + n * angularSpeed\n', value: 3 },
    ],
    3: [
      { label: 'n + 1', value: 1 },
      { label: 'x(n) = x0 - n * attractionForce\n' + 'y(n) = y0 - n * attractionForce\n', value: 2 },
      { label: '3n+1', value: 3 },
    ],
    4: [
      { label: 'x(n) = x0 - n * attractionForce\n' + 'y(n) = y0 - n * attractionForce\n', value: 1 },
      { label: 'x(0) = x0 - n * attractionForce\n' + 'y(0) = y0 - n * attractionForce\n', value: 2 },
      { label: '3n+1', value: 3 },
    ],
  };

  responseQuestions: { [key: number]: number } = {
    1: 1,
    2: 3,
    3: 2,
    4: 1,
  };

  dataEnemys: { x: number; y: number }[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.openDialog();
  }

  startRadar() {
    setInterval(() => {
      this.rotation = (this.rotation + 2) % 360;
    }, this.scanSpeed);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, { width: '600px', height: '700px' });

    dialogRef.afterClosed().subscribe(() => {
      this.route.params.subscribe((params) => {
        this.level = +params['level'];
        this.dataButtons = this.options[this.level];
        this.startRadar();
        this.generateInitialPoints();
        this.updateEnemyPositions();
        this.generateRadarLines();
      });
    });
  }

  onValidation(selectedPattern: number) {
    if (!this.validatePattern(selectedPattern)) {
      this.dialog.open(DialogComponent, {
        width: '600px',
        height: '700px',
        data: { message: 'Perdiste. Patrón incorrecto.' },
      });
      return;
    }

    if (this.level === 4) {
      this.dialog.open(DialogComponent, {
        width: '600px',
        height: '700px',
        data: { message: '¡Ganaste todos los niveles! Eres el ganador.' },
      });
      return;
    }

    this.level++;
    this.dataButtons = this.options[this.level];
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '700px',
      data: { message: '¡Ganaste este nivel! Avanzando al siguiente.' },
    });
  }

  validatePattern(selectedPattern: number): boolean {
    return selectedPattern === this.responseQuestions[this.level];
  }

  generateInitialPoints() {
    const numEnemies = 4;
    this.dataEnemys = Array.from({ length: numEnemies }, () => {
      const x = Math.floor(Math.random() * this.matrixSize);
      const y = Math.floor(Math.random() * this.matrixSize);
      return { x, y };
    });
  }

  updateEnemyPositions() {
    this.intervalId = setInterval(() => {
      const centerX = this.matrixSize / 2;
      const centerY = this.matrixSize / 2;

      this.dataEnemys = this.dataEnemys.map((enemy) => {
        const newX = Math.round(Math.max(0, Math.min(this.matrixSize, enemy.x - Math.sign(enemy.x - centerX))));
        const newY = Math.round(Math.max(0, Math.min(this.matrixSize, enemy.y - Math.sign(enemy.y - centerY))));
        return { x: newX, y: newY };
      });

      const hasLost = this.dataEnemys.some((enemy) => enemy.x === centerX && enemy.y === centerY);
      if (hasLost) {
        clearInterval(this.intervalId);
        this.dialog.open(DialogComponent, {
          width: '600px',
          height: '700px',
          data: { message: 'Perdiste. Un enemigo llegó al centro.' },
        });
      }
    }, 2000);
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