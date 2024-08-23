import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { Sector } from '../../../../core/models/sector.models';

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
    @Inject(MAT_DIALOG_DATA) public data: InformacionVentanaSectores,
    private readonly sectorsService: SectorsService,
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<SectorsAddComponent>,
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
    if (this.data.tipo_vista === 'editar') {
      this.asignarInformacion(this.data.sector!);
    }
  }

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  private asignarInformacion(informacion: Sector) {
    this.sectorForm.get('name')?.setValue(informacion.name);
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  private crear( ){
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
        }
      );
    }
  }

  private actualizar() {
    if (this.sectorForm.valid) {
      this.cargando$.next(true);
      this.sectorsService
        .update(this.data.sector!.id, this.sectorForm.value.name!, this.schema)
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
        }
      );
    }
  }

  public guardar() {
    if (this.data.tipo_vista === 'editar') {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  public cerrarVentana() {
    this.matDialogRef.close();
  }
}

export type InformacionVentanaSectores = {
  tipo_vista: 'crear' | 'editar';
  sector?: Sector;
};

