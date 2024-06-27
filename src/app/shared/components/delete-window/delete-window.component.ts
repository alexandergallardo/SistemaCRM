import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-window',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule],
  templateUrl: './delete-window.component.html',
  styleUrl: './delete-window.component.scss'
})
export class DeleteWindowComponent {
  public amount!: number;
  public message!: string;
  public comments = '';
  public title!: string;
  public action!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteWindowComponentInfo,
    public ventana: MatDialogRef<DeleteWindowComponent>,
    public snackBar: MatSnackBar,
  ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  public confirmarEliminar(): void {
    this.ventana.close(true);
  }

  public CerrarVentana() {
    this.ventana.close();
  }
}

export type DeleteWindowComponentInfo = {
  object: string;
  value: string;
};
