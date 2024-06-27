import { Component, Input, OnInit } from '@angular/core';
import { Opportunity } from '../../../../core/models/opportunity.models';
import { BehaviorSubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-opportunity-card',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './opportunity-card.component.html',
  styleUrl: './opportunity-card.component.scss'
})
export class OpportunityCardComponent {
  @Input() oportunidad!: Opportunity;
  private cargando$ = new BehaviorSubject<boolean>(false);

  public extraerIniciales(nombreCompleto: string): string {
    let partes = nombreCompleto.split(',');
    let nombre, apellido;

    if (partes.length > 1) {
        apellido = partes[0].trim().charAt(0);
        nombre = partes[1].trim().charAt(0);
    } 
    else {
        partes = nombreCompleto.split(' ');
        apellido = partes[0].trim().charAt(0);
        nombre = partes[partes.length - 1].trim().charAt(0);
    }

    return `${nombre}${apellido}`.toUpperCase();
  }
}
