import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../../core/services/roles.service';
import { Rol } from '../../../../core/models/rol.models';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {
  public roles: Rol[] = [];

  constructor(
    private readonly rolesService: RolesService, 
  ) {}
  ngOnInit(): void {
    this.listarRoles();
  }

  private listarRoles() {
    this.rolesService.getRoles('', 1, 20).subscribe(response => {
      if (response.status === 200) {
        this.roles = response.data;
        console.log(this.roles);
      }
    });
  }
}
