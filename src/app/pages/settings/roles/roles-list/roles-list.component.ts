import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../../core/services/roles.service';
import { Rol } from '../../../../core/models/rol.models';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {
  public roles: Rol[] = [];
  private schema: string = '';

  constructor(
    private readonly rolesService: RolesService, 
    private readonly authService: AuthService,
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
        console.log(this.roles);
      }
    });
  }
}
