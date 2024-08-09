import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, finalize } from 'rxjs';
import { Rol } from '../../../../core/models/rol.models';
import { RolesService } from '../../../../core/services/roles.service';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../../core/services/auth.service';

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
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<UsersAddComponent>,
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.listarRoles();
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

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public guardar() {
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

  private listarRoles() {
    this.rolesService.getRoles('',1,20, this.schema).subscribe((resultado) => {
      this.roles = resultado.data;
    });
  }

  public cerrarVentana() {
    this.matDialogRef.close();
  }
}
