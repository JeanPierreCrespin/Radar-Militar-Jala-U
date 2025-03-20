import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-radar-militar',
  imports: [CommonModule],
  templateUrl: './radar-militar.component.html',
  styleUrl: './radar-militar.component.scss'
})
export class RadarMilitarComponent implements AfterViewInit{

  @ViewChild('radarCanvas', { static: false }) radarCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private angle: number = 0;
  private centerX!: number;
  private centerY!: number;
  private radius!: number;
  private points: { x: number; y: number; detected: boolean }[] = [];

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.generatePoints(10); // Agrega 10 puntos
    this.animate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setupCanvas();
    this.generatePoints(10); // Regenera puntos al cambiar tamaño
  }

  private setupCanvas(): void {
    const canvas = this.radarCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx = canvas.getContext('2d')!;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.radius = Math.min(canvas.width, canvas.height) / 2.5;
  }

  private generatePoints(count: number): void {
    this.points = [];
    for (let i = 0; i < count; i++) {
      let angle = Math.random() * Math.PI * 2;
      let distance = Math.random() * this.radius * 0.9;
      let x = this.centerX + Math.cos(angle) * distance;
      let y = this.centerY + Math.sin(angle) * distance;
      this.points.push({ x, y, detected: false });
    }
  }

  private drawRadar(): void {
    this.ctx.clearRect(0, 0, this.radarCanvas.nativeElement.width, this.radarCanvas.nativeElement.height);

    // Fondo
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.radarCanvas.nativeElement.width, this.radarCanvas.nativeElement.height);

    // Círculos concéntricos
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 2;
    for (let i = this.radius / 5; i <= this.radius; i += this.radius / 5) {
      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, i, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Líneas cruzadas
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.centerY);
    this.ctx.lineTo(this.radarCanvas.nativeElement.width, this.centerY);
    this.ctx.moveTo(this.centerX, 0);
    this.ctx.lineTo(this.centerX, this.radarCanvas.nativeElement.height);
    this.ctx.stroke();

    // Dibujar puntos
    this.points.forEach(point => {
      let dx = point.x - this.centerX;
      let dy = point.y - this.centerY;
      let pointAngle = Math.atan2(dy, dx);
      if (pointAngle < 0) pointAngle += Math.PI * 2; // Ajustar ángulo negativo

      let angleDiff = Math.abs(pointAngle - this.angle);
      if (angleDiff < 0.2) {
        point.detected = true;
      }

      if (point.detected) {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Barrido animado
    let x = this.centerX + Math.cos(this.angle) * this.radius;
    let y = this.centerY + Math.sin(this.angle) * this.radius;
    this.ctx.strokeStyle = "lime";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.angle += 0.01;
  }

  private animate(): void {
    this.drawRadar();
    requestAnimationFrame(() => this.animate());
  }
}
