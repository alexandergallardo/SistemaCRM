import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsersService } from '../../../../core/services/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, finalize } from 'rxjs';
import { Rol } from '../../../../core/models/rol.models';
import { RolesService } from '../../../../core/services/roles.service';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/users.models';

@Component({
  selector: 'app-users-add',
  standalone: true,
  imports: [MatSelectModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './users-add.component.html',
  styleUrl: './users-add.component.scss'
})
export class UsersAddComponent implements OnInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public userForm = this.crearFormulario();
  private schema: string = '';
  public roles: Array<Rol> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformacionVentanaUsuarios,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<UsersAddComponent>,
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.listarRoles();
    if (this.data.tipo_vista === 'editar') {
      this.asignarInformacion(this.data.user!);
    }
  }

  private crearFormulario() {
    return new FormGroup({
      document: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rolId: new FormControl<number | null>(null, [Validators.required]),
    });
  }

  private asignarInformacion(informacion: User) {
    this.userForm.get('document')?.setValue(informacion.document);
    this.userForm.get('name')?.setValue(informacion.name);
    this.userForm.get('email')?.setValue(informacion.email);
    this.userForm.get('password')?.setValue(informacion.password);
    this.userForm.get('rolId')?.setValue(informacion.rolId);
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public crear() {
    if (this.userForm.valid) {
      this.cargando$.next(true);
  
      this.usersService
        .create(
          this.userForm.value.document!,
          this.userForm.value.name!,
          this.userForm.value.email!,
          this.userForm.value.password!,
          this.userForm.value.rolId!,
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
            console.error('Error al guardar usuario:', error);
            this.matDialogRef.close(false);
          }
        });
    }
  }

  public actualizar() {
    if (this.userForm.valid) {
      this.cargando$.next(true);
  
      this.usersService
        .update(
          this.data.user!.id,
          this.userForm.value.document!,
          this.userForm.value.name!,
          this.userForm.value.email!,
          this.userForm.value.password!,
          this.userForm.value.rolId!,
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
            console.error('Error al guardar usuario:', error);
            this.matDialogRef.close(false);
          }
        });
    }
  }

  public guardar() {
    if (this.data.tipo_vista === 'editar') {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  private listarRoles() {
    this.rolesService.getRoles('',1,20, this.schema).subscribe((resultado) => {
      this.roles = resultado.data;
    });
  }

  public cerrarVentana() {
    this.matDialogRef.close();
  }
}

export type InformacionVentanaUsuarios = {
  tipo_vista: 'crear' | 'editar';
  user?: User;
};
