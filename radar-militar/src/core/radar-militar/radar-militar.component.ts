import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

interface DataButton{
  label: string,
  value: number
}
@Component({
  selector: 'app-radar-militar',
  imports: [CommonModule, RouterLink],
  templateUrl: './radar-militar.component.html',
  styleUrl: './radar-militar.component.scss',
  standalone: true
})
export class RadarMilitarComponent implements OnInit {
  level: number = 1;
  rotation = 0;
  scanSpeed = 80;
  matrixSize = 100; // Define el tamaño de la matriz
  radarLines: { angle: number; x2: number; y2: number }[] = [];
  intervalId: any;

  dataButtons: DataButton[] = [];

  options: { [key: number]: DataButton[] } = {
    1:  [
      {
        label: 'x(n) = x0 - n * speed\n' +
          'y(n) = y0 - n * speed\n',
        value: 1
      },
      {
        label: 'n+2',
        value: 2
      },
      {
        label: '3n+1',
        value:3
      },
    ],
    2:  [
      {
        label: 'n + 1',
        value: 1
      },
      {
        label: 'n+2',
        value: 2
      },
      {
        label: 'radius(n) = radius0 - n * speed\n' +
          'angle(n) = angle0 + n * angularSpeed\n',
        value:3
      },
    ],
    3:  [
      {
        label: 'n + 1',
        value: 1
      },
      {
        label: 'x(n) = x0 - n * attractionForce\n' +
          'y(n) = y0 - n * attractionForce\n',
        value: 2
      },
      {
        label: '3n+1',
        value:3
      },
    ],
    4:  [
      {
        label: 'x(n) = x0 - n * attractionForce\n' +
          'y(n) = y0 - n * attractionForce\n',
        value: 1
      },
      {
        label: 'x(0) = x0 - n * attractionForce\n' +
          'y(0) = y0 - n * attractionForce\n',
        value: 2
      },
      {
        label: '3n+1',
        value:3
      },
    ]
  };

  responseQuestions: { [key: number]: number } = {
  1:  1,
  2:  3,
  3:  2,
  4: 1
};

  dataEnemys: { x: number; y: number }[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.level = +params['level'];
      this.dataButtons = this.options[this.level]
      this.startRadar();
      this.generateInitialPoints();
      this.updateEnemyPositions();
      this.generateRadarLines();
    });

  }

  startRadar() {
    setInterval(() => {
      this.rotation = (this.rotation + 2) % 360;
    }, this.scanSpeed);
  }

  onValidation(selectedPattern: number) {
    if (!this.validatePattern(selectedPattern)) {
      alert('Patrón incorrecto. Inténtalo de nuevo.');
      return;
    }

    alert('¡Has ganado! Patrón correcto.');

    const paths: { [key: number]: string } = {
      1: '/radar/2',
      2: '/radar/3',
      3: '/radar/4',
      4: ''
    };

    const path = paths[this.level] || '';  // Si `this.level` no está definido, usa una cadena vacía

    if (path) {
      this.router.navigate([path]);
    }
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
        let newX = enemy.x;
        let newY = enemy.y;

        let speed = 1;

        if (this.level === 1) {
          // Movimiento Lineal hacia el centro
          newX = Math.round(Math.max(0, Math.min(this.matrixSize, enemy.x - Math.sign(enemy.x - centerX) * speed)));
          newY = Math.round(Math.max(0, Math.min(this.matrixSize, enemy.y - Math.sign(enemy.y - centerY) * speed)));

        } else if (this.level === 2) {
          // Movimiento Espiral (con radio decreciente)
          let dx = enemy.x - centerX;
          let dy = enemy.y - centerY;
          let radius = Math.sqrt(dx * dx + dy * dy); // Calculamos el radio actual
          let angle = Math.atan2(dy, dx); // Ángulo del enemigo respecto al centro

          radius = Math.max(0, radius - speed); // Reducimos el radio para acercarlo
          angle += 0.2; // Ajustamos la rotación para que no sea tan lenta

          newX = Math.round(centerX + radius * Math.cos(angle));
          newY = Math.round(centerY + radius * Math.sin(angle));

        } else if (this.level === 3) {
          // Movimiento Flotante (con atracción hacia el centro)
          const attractionForce = 0.1;
          const randomness = (Math.random() - 0.5) * 3;

          newX = Math.round(Math.max(0, Math.min(this.matrixSize, enemy.x - (enemy.x - centerX) * attractionForce + randomness)));
          newY = Math.round(Math.max(0, Math.min(this.matrixSize, enemy.y - (enemy.y - centerY) * attractionForce + randomness)));

        } else if (this.level === 4) {
          // Movimiento Fibonacci
          const goldenRatio = 1.618; // Número áureo
          let angle = Math.atan2(enemy.y - centerY, enemy.x - centerX);
          let radius = Math.sqrt(Math.pow(enemy.x - centerX, 2) + Math.pow(enemy.y - centerY, 2));

          // Se utiliza el radio decreciente y el ángulo crece con el número áureo
          radius -= speed;
          angle += goldenRatio;

          newX = Math.round(centerX + radius * Math.cos(angle));
          newY = Math.round(centerY + radius * Math.sin(angle));
        }

        return { x: newX, y: newY };
      });

      // Verificación de derrota
      const hasLost = this.dataEnemys.some((enemy) => enemy.x === centerX && enemy.y === centerY);
      if (hasLost) {
        alert('¡Has perdido! Un enemigo ha llegado al centro.');
        clearInterval(this.intervalId);
        this.startRadar();
        this.generateInitialPoints();
        this.updateEnemyPositions();
        this.generateRadarLines();
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

