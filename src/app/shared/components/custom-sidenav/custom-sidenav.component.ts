import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../core/models/menuItem.models';
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { User } from '../../../core/models/users.models';
import { EstadoGlobal, obtenerUsuario } from '../../../core/reducers/estado-global.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-custom-sidenav',
    standalone: true,
    templateUrl: './custom-sidenav.component.html',
    styleUrl: './custom-sidenav.component.scss',
    imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent]
})
export class CustomSidenavComponent implements OnInit{
  public usuarioActual: User | null = null;

  constructor(
    private store: Store<EstadoGlobal>
  ) {}

  ngOnInit() {
    this.obtenerUsuario();
  }

  private obtenerUsuario() {
    this.store.select(obtenerUsuario).subscribe((usuario) => {
      this.usuarioActual = usuario;
    });
  }

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  menuItems = signal<MenuItem[]>([
    {
      icon: 'monetization_on',
      label: 'Ventas',
      route: 'sales',
      subItems: [
        {
          icon: 'comment',
          label: 'Cuentas',
          route: 'accounts',
        },
        {
          icon: 'contacts',
          label: 'Contactos',
          route: 'contacts',
        },
        {
          icon: 'trending_up',
          label: 'Oportunidades',
          route: 'opportunities',
        }
      ]
    },
    {
      icon: 'campaign',
      label: 'Marketing',
      route: 'marketing',
      subItems: [
        {
          icon: 'lightbulb',
          label: 'Leads',
          route: 'leads',
        },
        {
          icon: 'ads_click',
          label: 'Campañas',
          route: 'campaigns',
        }
      ]
    },
    {
      icon: 'assessment',
      label: 'Reportes',
      route: 'reports',
      subItems: [
        {
          icon: 'bar_chart',
          label: 'Gráficos',
          route: 'charts',
        },
        {
          icon: 'calendar_today',
          label: 'Calendario',
          route: 'calendar',
        }
      ]
    },
    {
      icon: 'settings',
      label: 'Configuración',
      route: 'settings',
      subItems: [
        {
          icon: 'settings',
          label: 'Sectores',
          route: 'sectors',
        },
        {
          icon: 'settings',
          label: 'Servicios',
          route: 'services',
        },
        {
          icon: 'settings',
          label: 'Roles',
          route: 'roles',
        },
      ]
    },
    {
      icon: 'supervised_user_circle',
      label: 'Usuarios',
      route: 'users'
    },
    {
      icon: 'info',
      label: 'Información',
      route: 'information'
    }

  ]);

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
