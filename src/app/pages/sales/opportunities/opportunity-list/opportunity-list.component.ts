import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { OpportunityListCardsComponent } from "./opportunity-list-cards/opportunity-list-cards.component";
import { OpportunityListTableComponent } from "./opportunity-list-table/opportunity-list-table.component";
import { SalesStageComponent } from "./../../sales-stage/sales-stage.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { OportunitiesService } from '../../../../core/services/opportunities.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Opportunity } from '../../../../core/models/opportunity.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalesStage } from '../../../../core/models/sales_stage.models';
import { SalesStageService } from '../../../../core/services/sales-stage.service';
import { InformacionVentanaOportunidad, OpportunityAddComponent } from '../opportunity-add/opportunity-add.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-opportunities',
    standalone: true,
    templateUrl: './opportunity-list.component.html',
    styleUrl: './opportunity-list.component.scss',
    imports: [MatProgressSpinnerModule, MatFormFieldModule, MatToolbarModule, MatIconModule, MatCardModule, CommonModule, OpportunityListCardsComponent, OpportunityListTableComponent, MatMenuModule, MatButtonModule, MatPaginatorModule, DragDropModule, SalesStageComponent]
})
export class OpportunityListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public selectedView = 'cards';
  public cargando$ = new BehaviorSubject<boolean>(false);
  public oportunidades: Opportunity[] = [];
  public totalRegistros!: number;
  public listas: SalesStage[] = [];
  public schema: string = '';
  public configurandoEtapas = false;

  constructor(
    private readonly oportunitiesService: OportunitiesService,
    private readonly matDialog: MatDialog,
    private readonly salesStageService: SalesStageService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
    //this.obtenerEtapasDeVenta();
    this.verificarEtapasDeVenta();
    this.listarOportunidades();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.listarOportunidades();
      });
    }
  }

  selectView(view: string) {
    this.selectedView = view;
    if (this.selectedView === 'tabla') {
      this.listarOportunidades();
    }
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }
  
  private obtenerEtapasDeVenta(): void {
    this.salesStageService.getSalesStages(1, 10, this.schema).subscribe({
      next: (respuesta) => {
        this.listas = respuesta.data;
      },
      error: (error) => {
        console.error('Error al obtener etapas de venta:', error);
      }
    });
  }

  private verificarEtapasDeVenta() {
    this.cargando$.next(true);

    this.salesStageService.getSalesStages(1, 20, this.schema).subscribe({
      next: (respuesta) => {
        this.listas = respuesta.data.sort((a, b) => a.position - b.position);
        this.cargando$.next(false);
        this.configurandoEtapas = this.listas.length === 0;
      },
      error: (error) => {
        console.error('Error al verificar etapas de venta:', error);
        this.cargando$.next(false);
      }
    });
  }

  public onEtapasGuardadas() {
    this.verificarEtapasDeVenta();
  }

  private listarOportunidades() {
    this.cargando$.next(true);

    this.oportunitiesService
      .getOportunities(
        this.paginator?.pageIndex + 1 || 1,
        this.paginator?.pageSize || 10,
        this.schema
      )
      .pipe(
        finalize(() => {
          this.cargando$.next(false);
        }),
      )
      .subscribe((respuesta) => {
        if (respuesta) {
          this.oportunidades = respuesta.data;
          this.totalRegistros = respuesta.total;
        } else {
          this.oportunidades = [];
          this.totalRegistros = 0;
        }
      });
  }

  public agregar() {
    const informacion: InformacionVentanaOportunidad = {
      tipo_vista: 'ver',
    }
    const ventana = this.matDialog.open(OpportunityAddComponent, {
      width: '1100px',
      data: informacion,
      disableClose: true,
    });

    ventana.afterClosed().subscribe((respuesta) => {
      if (respuesta === true) {
        this.notificationService.Snack('Se creó la oportunidad con éxito', '');
        this.listarOportunidades();
      }
      if (respuesta === false) {
        this.notificationService.Snack('Ocurrió un error al crear la oportunidad', '');
      }
    });
  }
}
