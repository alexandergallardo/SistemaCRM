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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ServicesService } from '../../../../core/services/services.service';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-services-add',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './services-add.component.html',
  styleUrl: './services-add.component.scss'
})
export class ServicesAddComponent implements OnInit{
  public cargando$ = new BehaviorSubject<boolean>(false);
  public serviceForm = this.crearFormulario();
  private schema: string = '';

  constructor(
    private readonly servicesService: ServicesService,
    private readonly matDialogRef: MatDialogRef<ServicesAddComponent>,
    private readonly authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { maxCode: number },
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
  }

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      measurementUnit: new FormControl('', [Validators.required]),
    });
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public guardar() {
    if (this.serviceForm.valid) {
      this.cargando$.next(true);
  
      const newCodeNumber  = this.data.maxCode + 1;
      const newCode = `SVC${newCodeNumber.toString().padStart(3, '0')}`;

      this.servicesService
        .create(
          newCode,
          this.serviceForm.value.name!,
          this.serviceForm.value.measurementUnit!,
          this.schema
        )
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
            console.error('Error al guardar servicio:', error);
            this.matDialogRef.close(false);
          }
        });}}

  public cerrarVentana() {
    this.matDialogRef.close();
  }
}

