import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, finalize } from 'rxjs';
import { RolesService } from '../../../../core/services/roles.service';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-roles-add',
  standalone: true,
  imports: [MatInputModule, MatAutocompleteModule, MatRadioModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './roles-add.component.html',
  styleUrl: './roles-add.component.scss'
})
export class RolesAddComponent implements OnInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public roleForm = this.crearFormulario();
  public opcionesPermiso = [
    { nombre: 'No', valor: 1 },
    { nombre: 'Lectura', valor: 2 },
    { nombre: 'Lectura sensible', valor: 3 },
    { nombre: 'Modificación', valor: 4 }
  ];
  private schema: string = '';

  constructor(
    private readonly matDialogRef: MatDialogRef<RolesAddComponent>,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
    this.crearFormulario();
  }

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', []),
      sales: new FormGroup({
        accounts: new FormControl(0, []),
        contacts: new FormControl(0, []),
        opportunities: new FormControl(0, []),
      }),
      marketing: new FormGroup({
        leads: new FormControl(0, []),
        campaigns: new FormControl(0, []),
      }),
      reports: new FormGroup({
        charts: new FormControl(0, []),
        calendar: new FormControl(0, []),
      }),
      settings: new FormGroup({
        sectors: new FormControl(0, []),
        services: new FormControl(0, []),
      }),
      users: new FormGroup({
        users: new FormControl(0, []),
      }),
      information: new FormGroup({
        information: new FormControl(0, []),
      }),
    });
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public guardar() {
    if (this.roleForm.valid) {
      this.cargando$.next(true);
      const { name, ...permissions } = this.roleForm.value;

      this.rolesService.create(name!, permissions, this.schema)
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
          console.error('Error al guardar rol:', error);
          this.matDialogRef.close(false);
        }
      });
    }
  }
  public cerrarVentana() {
    this.matDialogRef.close();
  }
}
