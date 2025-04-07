import {CommonModule} from '@angular/common';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DialogComponent} from './dialog/dialog.component';

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
export class RadarMilitarComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  level: number = Number(localStorage.getItem('currentLevel')) || 1;
  rotation = 0;
  scanSpeed = 80;
  matrixSize = 100; // Define el tamaño de la matriz
  radarLines: { angle: number; x2: number; y2: number }[] = [];
  intervalId: any;
  radarIntervalId: any;

  dataButtons: DataButton[] = [];

  options: { [key: number]: DataButton[] } = {
    1: [
      { 
        label: 'MOVIMIENTO LINEAL DIRECTO\n' + 
               'x(t) = x₀ - t × velocidad\n' + 
               'y(t) = y₀ - t × velocidad\n' +
               'Los objetivos se mueven directamente hacia el centro.',
        value: 1 
      },
      { 
        label: 'MOVIMIENTO ORBITAL\n' + 
               'x(t) = x₀ + radio × cos(t × velocidadAngular)\n' + 
               'y(t) = y₀ + radio × sin(t × velocidadAngular)\n' +
               'Los objetivos orbitan alrededor del centro.',
        value: 2 
      },
      { 
        label: 'MOVIMIENTO ZIGZAG\n' + 
               'x(t) = x₀ - t × velocidad + oscilación × sin(t)\n' + 
               'y(t) = y₀ - t × velocidad + oscilación × cos(t)\n' +
               'Los objetivos avanzan en patrón zigzag.',
        value: 3 
      },
    ],
    2: [
      { 
        label: 'PATRÓN ACELERADO\n' + 
               'x(t) = x₀ - t² × aceleración\n' + 
               'y(t) = y₀ - t² × aceleración\n' +
               'Los objetivos aumentan su velocidad con el tiempo.',
        value: 1 
      },
      { 
        label: 'PATRÓN ALEATORIO\n' + 
               'x(t) = x₀ - t × velocidad + aleatorio()\n' + 
               'y(t) = y₀ - t × velocidad + aleatorio()\n' +
               'Los objetivos se mueven con componente aleatoria.',
        value: 2 
      },
      { 
        label: 'PATRÓN ESPIRAL\n' + 
               'radio(t) = radio₀ - t × velocidad\n' + 
               'ángulo(t) = ángulo₀ + t × velocidadAngular\n' +
               'Los objetivos se acercan en espiral al centro.',
        value: 3 
      },
    ],
    3: [
      { 
        label: 'MOVIMIENTO PULSANTE\n' + 
               'x(t) = x₀ - t × velocidad × (1 + sin(t))\n' + 
               'y(t) = y₀ - t × velocidad × (1 + cos(t))\n' +
               'Los objetivos avanzan con velocidad variable.',
        value: 1 
      },
      { 
        label: 'ATRACCIÓN GRAVITACIONAL\n' + 
               'x(t) = x₀ - t × fuerzaAtracción × (x₀ - xCentro)/distancia\n' + 
               'y(t) = y₀ - t × fuerzaAtracción × (y₀ - yCentro)/distancia\n' +
               'Los objetivos son atraídos por el centro.',
        value: 2 
      },
      { 
        label: 'MOVIMIENTO EVASIVO\n' + 
               'x(t) = x₀ - t × velocidad + evasión(t)\n' + 
               'y(t) = y₀ - t × velocidad + evasión(t)\n' +
               'Los objetivos intentan evadir la intercepción.',
        value: 3 
      },
    ],
    4: [
      { 
        label: 'ATRACCIÓN GRAVITACIONAL AVANZADA\n' + 
               'x(t) = x₀ - t × fuerzaAtracción × (x₀ - xCentro)/distancia\n' + 
               'y(t) = y₀ - t × fuerzaAtracción × (y₀ - yCentro)/distancia\n' +
               'Los objetivos aceleran hacia el centro.',
        value: 1 
      },
      { 
        label: 'PATRÓN REFLECTIVO\n' + 
               'x(t) = x₀ + (−1)^rebotes × t × velocidad\n' + 
               'y(t) = y₀ + (−1)^rebotes × t × velocidad\n' +
               'Los objetivos cambian dirección al rebotar.',
        value: 2 
      },
      { 
        label: 'FORMACIÓN TÁCTICA\n' + 
               'x(t) = x₀ - t × velocidad + formación(índice, t)\n' + 
               'y(t) = y₀ - t × velocidad + formación(índice, t)\n' +
               'Los objetivos mantienen formación mientras avanzan.',
        value: 3 
      },
    ],
  };

  responseQuestions: { [key: number]: number } = {
    1: 1,
    2: 3,
    3: 2,
    4: 1,
  };

  dataEnemys: { x: number; y: number }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.openDialog();
  }

  startRadar() {
    // Detener el barrido anterior si existe
    if (this.radarIntervalId) {
      clearInterval(this.radarIntervalId);
    }

    // Iniciar nuevo barrido
    this.radarIntervalId = setInterval(() => {
      this.rotation = (this.rotation + 2) % 360;
    }, this.scanSpeed);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'fullscreen-dialog',
      data: {
        level: this.level,
        message: 'Preparando coordenadas de escaneo...',
        buttonLabel: this.level == 1? 'Iniciar Misión': 'Continuar'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Limpiar cualquier intervalo existente antes de iniciar
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      this.route.params.subscribe((params) => {
        this.level = +params['level'];
        localStorage.setItem('currentLevel', this.level.toString());
        this.dataButtons = this.options[this.level];
        this.startRadar();
        this.generateInitialPoints();
        this.updateEnemyPositions();
        this.generateRadarLines();
      });
    });
  }

  onValidation(selectedPattern: number) {
    // Detener el movimiento de los enemigos
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    const isPatternValid = this.validatePattern(selectedPattern);
    const dialogConfig = {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'fullscreen-dialog',
      data: {
        level: this.level,
        message: '',
        buttonLabel: '',
        isError: false
      },
    };

    if (!isPatternValid) {
      localStorage.setItem('currentLevel', this.level.toString());
      dialogConfig.data.message = 'Perdiste. Patrón incorrecto. ¡Vuelve a intentarlo!';
      dialogConfig.data.buttonLabel = '¡Volver a intentarlo!';
      dialogConfig.data.isError = true;
      const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

      // Reactivar el movimiento de enemigos cuando se cierra el diálogo
      dialogRef.afterClosed().subscribe(() => {
        this.generateInitialPoints();
        this.updateEnemyPositions();
      });
      return;
    }

    if (this.level === 4) {
      dialogConfig.data.message = '¡Ganaste todos los niveles! Eres el ganador.';
      dialogConfig.data.buttonLabel = 'Volver a Jugar';
      this.dialog.open(DialogComponent, dialogConfig);
      return;
    }

    this.level++;
    this.dataButtons = this.options[this.level];
    dialogConfig.data.message = '¡Ganaste este nivel! Avanzando al siguiente.';
    dialogConfig.data.buttonLabel = 'Continuar';
    this.dialog.open(DialogComponent, dialogConfig);
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
    // Limpiar cualquier intervalo existente para evitar múltiples intervalos
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

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
        this.intervalId = null;
        localStorage.setItem('currentLevel', this.level.toString());
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          panelClass: 'fullscreen-dialog',
          data: {
            level: this.level,
            message: 'Perdiste. Un enemigo llegó al centro.',
            buttonLabel: '¡Volver a intentarlo!',
            isError: true
          },
        });

        dialogRef.afterClosed().subscribe(() => {
          // Regenerar enemigos y reactivar su movimiento
          this.generateInitialPoints();
          this.updateEnemyPositions();
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

  // Método para calcular el porcentaje de distancia para la barra de progreso
  calcularDistanciaPorcentaje(x: number, y: number): number {
    // Coordenadas del centro del radar
    const centerX = 50;
    const centerY = 50;

    // Cálculo de la distancia euclidiana
    const dx = x - centerX;
    const dy = y - centerY;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    // Convertir la distancia a un porcentaje (valores más pequeños para enemigos más cercanos)
    // 70.71 es aproximadamente la distancia máxima desde el centro a una esquina (50*sqrt(2))
    return Math.max(0, Math.min(100, 100 - (distancia * 100 / 70.71)));
  }

  ngOnDestroy() {
    // Limpiar todos los intervalos al destruir el componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.radarIntervalId) {
      clearInterval(this.radarIntervalId);
      this.radarIntervalId = null;
    }
  }
}
