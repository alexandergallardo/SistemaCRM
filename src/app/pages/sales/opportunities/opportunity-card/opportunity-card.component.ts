import { Component, Input, OnInit } from '@angular/core';
import { Opportunity } from '../../../../core/models/opportunity.models';
import { BehaviorSubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { InformacionVentanaOportunidad, OpportunityAddComponent } from '../opportunity-add/opportunity-add.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { SalesStage } from '../../../../core/models/sales_stage.models';

@Component({
  selector: 'app-opportunity-card',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './opportunity-card.component.html',
  styleUrl: './opportunity-card.component.scss'
})
export class OpportunityCardComponent {
  @Input() oportunidad!: Opportunity;
  @Input() listas!: SalesStage;
  private cargando$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly matDialog: MatDialog,
    private readonly notificationService: NotificationService,
  ) {}

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

  public editar(oportunidad: Opportunity) {
    const informacion: InformacionVentanaOportunidad = {
      tipo_vista: 'editar',
      opportunity: oportunidad,
    };
    const ventana = this.matDialog.open(OpportunityAddComponent, {
      width: '1100px',
      data: informacion,
      disableClose: true,
    });

    ventana.afterClosed().subscribe((respuesta) => {
      if (respuesta === true) {
        this.notificationService.Snack('Se actualizó la oportunidad con éxito', '');
      }
      if (respuesta === false) {
        this.notificationService.Snack('Ocurrió un error al actualizar la oportunidad', '');
      }
    });
  }
}
