import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../../core/services/roles.service';
import { Rol } from '../../../../core/models/rol.models';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RolesAddComponent } from '../roles-add/roles-add.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [MatCardModule, MatToolbarModule, MatIconModule, MatSelectModule, MatInputModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatRadioModule, MatButtonModule, MatGridListModule, ],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public roleForm = this.crearFormulario();
  public roles: Rol[] = [];
  public schema: string = '';

  public opcionesPermiso = [
    { nombre: 'No', valor: 1 },
    { nombre: 'Lectura', valor: 2 },
    { nombre: 'Lectura sensible', valor: 3 },
    { nombre: 'Modificación', valor: 4 }
  ];

  constructor(
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
    private readonly matDialog: MatDialog,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
    this.listarRoles();
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  private listarRoles() {
    this.rolesService.getRoles('', 1, 20, this.schema).subscribe(response => {
      if (response.status === 200) {
        this.roles = response.data;
      }
    });
  }

  private crearFormulario() {
    return new FormGroup({
      selectedRole: new FormControl('', []),
      sales: new FormGroup({
        accounts: new FormControl({ value: 1, disabled: true }, []),
        contacts: new FormControl({ value: 1, disabled: true }, []),
        opportunities: new FormControl({ value: 1, disabled: true }, []),
      }),
      marketing: new FormGroup({
        leads: new FormControl({ value: 1, disabled: true }, []),
        campaigns: new FormControl({ value: 1, disabled: true }, []),
      }),
      reports: new FormGroup({
        charts: new FormControl({ value: 1, disabled: true }, []),
        calendar: new FormControl({ value: 1, disabled: true }, []),
      }),
      settings: new FormGroup({
        sectors: new FormControl({ value: 1, disabled: true }, []),
        services: new FormControl({ value: 1, disabled: true }, []),
      }),
      users: new FormGroup({
        users: new FormControl({ value: 1, disabled: true }, []),
      }),
      information: new FormGroup({
        information: new FormControl({ value: 1, disabled: true }, []),
      }),
    });
  }

  public onRoleChange(selectedRole: Rol) {
    if (selectedRole && selectedRole.permissions) {
      console.log(selectedRole);
      console.log(selectedRole.permissions);

      this.roleForm.patchValue({
        sales: {
          accounts: selectedRole.permissions.sales?.['accounts'] || 0,
          contacts: selectedRole.permissions.sales?.['contacts'] || 0,
          opportunities: selectedRole.permissions.sales?.['opportunities'] || 0,
        },
        marketing: {
          leads: selectedRole.permissions.marketing?.['leads'] || 0,
          campaigns: selectedRole.permissions.marketing?.['campaigns'] || 0,
        },
        reports: {
          charts: selectedRole.permissions.reports?.['charts'] || 0,
          calendar: selectedRole.permissions.reports?.['calendar'] || 0,
        },
        settings: {
          sectors: selectedRole.permissions.settings?.['sectors'] || 0,
          services: selectedRole.permissions.settings?.['services'] || 0,
        },
        users: {
          users: selectedRole.permissions.users?.['users'] || 0,
        },
        information: {
          information: selectedRole.permissions.information?.['information'] || 0,
        }
      });
    }
  }

  public agregar() {
    const ventana = this.matDialog.open(RolesAddComponent, {
      width: '1100px',
      disableClose: true,
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.notificationService.Snack('Se creó el contacto satisfactoriamente', 'Entendido');
        this.listarRoles();
      } else if (response === false) {
        this.notificationService.Snack('Ocurrió un error al crear el contacto', 'Entendido');
      }
    });
  }
}