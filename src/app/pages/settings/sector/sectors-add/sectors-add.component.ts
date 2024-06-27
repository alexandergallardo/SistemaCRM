import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { BehaviorSubject, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SectorsService } from '../../../../core/services/sectors.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sectors-add',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './sectors-add.component.html',
  styleUrl: './sectors-add.component.scss'
})
export class SectorsAddComponent {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public sectorForm = this.crearFormulario();

  constructor(
    private sectorsService: SectorsService,
    private readonly matDialogRef: MatDialogRef<SectorsAddComponent>,
  ) {}

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  public guardar() {
    if (this.sectorForm.valid) {
      this.cargando$.next(true);
  
      this.sectorsService
        .create(this.sectorForm.value.name!)
        .pipe(
          finalize(() => {
            this.cargando$.next(false);
          })
        )
        .subscribe({
          next: (response) => {
            this.matDialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al guardar sector:', error);
            this.matDialogRef.close(false);
          }
        });}}

  public cerrarVentana() {
    this.matDialogRef.close();
  }
}
