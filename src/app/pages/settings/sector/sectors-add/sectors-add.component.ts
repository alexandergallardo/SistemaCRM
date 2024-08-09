import { Component, OnInit } from '@angular/core';
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
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sectors-add',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './sectors-add.component.html',
  styleUrl: './sectors-add.component.scss'
})
export class SectorsAddComponent implements OnInit{
  public cargando$ = new BehaviorSubject<boolean>(false);
  public sectorForm = this.crearFormulario();
  private schema: string = '';

  constructor(
    private readonly sectorsService: SectorsService,
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<SectorsAddComponent>,
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
  }

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }


  public guardar() {
    if (this.sectorForm.valid) {
      this.cargando$.next(true);
  
      this.sectorsService
        .create(this.sectorForm.value.name!, this.schema)
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
