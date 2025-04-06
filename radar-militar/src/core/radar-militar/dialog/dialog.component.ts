import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface DialogData {
  message: string;
  buttonLabel: string;
  level: number;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DialogComponent>,
    private router: Router
  ) {}

  // Getters para acceder directamente a los datos inyectados
  get mensaje(): string {
    return this.data?.message ?? '';
  }

  get buttonLabel(): string {
    return this.data?.buttonLabel ?? '';
  }

  get level(): number {
    return this.data?.level ?? 1;
  }

  // Método que maneja la acción del botón del diálogo
  onButtonClick(): void {
    console.log(this.level)
    if (this.buttonLabel === '¡Volver a intentarlo!' || this.buttonLabel === 'Iniciar Misión') {
      this.router.navigate([`/radar/${this.level}`]);
    } else {
      const nextLevel = this.level < 4 ? this.level + 1 : 1;
      this.router.navigate([`/radar/${nextLevel}`]);
    }

    this.dialogRef.close(); // Cierra el diálogo
  }
}
