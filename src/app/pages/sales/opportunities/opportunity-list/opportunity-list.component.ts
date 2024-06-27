import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { OpportunityListCardsComponent } from "./opportunity-list-cards/opportunity-list-cards.component";
import { OpportunityListTableComponent } from "./opportunity-list-table/opportunity-list-table.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { OportunitiesService } from '../../../../core/services/opportunities.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Opportunity } from '../../../../core/models/opportunity.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalesStage } from '../../../../core/models/sales_stage.models';
import { SalesStageService } from '../../../../core/services/sales-stage.service';

@Component({
    selector: 'app-opportunities',
    standalone: true,
    templateUrl: './opportunity-list.component.html',
    styleUrl: './opportunity-list.component.scss',
    imports: [MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatCardModule, CommonModule, OpportunityListCardsComponent, OpportunityListTableComponent, MatMenuModule, MatButtonModule, MatPaginatorModule]
})
export class OpportunityListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public selectedView = 'cards';
  public cargando$ = new BehaviorSubject<boolean>(false);
  public oportunidades: Opportunity[] = [];
  public totalRegistros!: number;
  public listas: SalesStage[] = [];

  constructor(
    private readonly oportunitiesService: OportunitiesService,
    private readonly salesStageService: SalesStageService
  ) {}

  ngOnInit(): void {
    this.obtenerEtapasDeVenta();
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

  private obtenerEtapasDeVenta(): void {
    this.salesStageService.getSalesStage(1, 10).subscribe({
      next: (respuesta) => {
        this.listas = respuesta.data;
      },
      error: (error) => {
        console.error('Error al obtener etapas de venta:', error);
      }
    });
  }

  private listarOportunidades() {
    this.cargando$.next(true);

    this.oportunitiesService
      .getOportunities(
        this.paginator?.pageIndex + 1 || 1,
        this.paginator?.pageSize || 10,
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
}
