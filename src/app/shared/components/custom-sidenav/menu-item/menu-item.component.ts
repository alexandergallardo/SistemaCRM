import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from '../../../../core/models/menuItem.models';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [MatListModule, RouterModule, MatIconModule],
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('500ms ease-in-out', style({opacity: 1, height: '*'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0, height: '0px'}))
      ])
    ])
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  item = input.required<MenuItem>();

  collapsed = input(false);

  nestedMenuOpen = signal(false);
  constructor(private router: Router) {}


  toggleNested() {
    if (!this.item().subItems) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen())
  }

  handleClick(item: MenuItem) {
    if (item.subItems) {
      this.toggleNested();
    } else {
      this.navigateToRoute(item.route!);
    }
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  isSelected(item: MenuItem): boolean {
    return this.router.url.includes(item.route!);
  }
}
