import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { Opportunity } from '../../../../../core/models/opportunity.models';
import { OpportunityCardComponent } from '../../opportunity-card/opportunity-card.component';
import { SalesStage } from '../../../../../core/models/sales_stage.models';
import { OportunitiesService } from '../../../../../core/services/opportunities.service';
import { SalesStageService } from '../../../../../core/services/sales-stage.service';

@Component({
  selector: 'app-opportunity-list-cards',
  standalone: true,
  imports: [CommonModule, DragDropModule, OpportunityCardComponent],
 
  templateUrl: './opportunity-list-cards.component.html',
  styleUrl: './opportunity-list-cards.component.scss'
})

export class OpportunityListCardsComponent implements OnInit, OnChanges {
  @Input() oportunidades: Opportunity[] = [];
  @Input() listas: SalesStage[] = [];
  @Input() schema: string = '';
  public oportunidadesMap: Map<number, Opportunity[]> = new Map<number, Opportunity[]>();
  private posicionIdMap: Map<number, number> = new Map<number, number>();

  constructor(private readonly oportunitiesService: OportunitiesService, private readonly salesStageService: SalesStageService) {}

  ngOnInit(): void {
    this.obtenerEtapas();
    this.agruparOportunidadesPorIdLista();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['oportunidades'] && !changes['oportunidades'].firstChange) {
      this.agruparOportunidadesPorIdLista();
    }
  }

  drop(event: CdkDragDrop<Opportunity[]>) {
    if (event.previousContainer && event.container) {
      const previousData = event.previousContainer.data || [];
      const containerData = event.container.data || [];

        if ('length' in previousData && 'length' in containerData) {
          transferArrayItem(previousData, containerData, event.previousIndex, event.currentIndex);
          const oportunidad = containerData[event.currentIndex];
          const nuevaPosition = +event.container.id;
          const nuevaIdLista = this.posicionIdMap.get(nuevaPosition);

          if (nuevaIdLista !== undefined) {
            oportunidad.salesStageId = nuevaIdLista;
    
            this.oportunitiesService.updateOpportunityStage(oportunidad.id, nuevaIdLista, this.schema).subscribe({
              next: (response) => {
                console.log('Oportunidad actualizada exitosamente', response);
                oportunidad.salesStageId = nuevaIdLista;
                this.agruparOportunidadesPorIdLista();
              },
              error: (error) => {
                console.error('Error al actualizar la oportunidad', error);
                transferArrayItem(containerData, previousData, event.currentIndex, event.previousIndex);
                oportunidad.salesStageId = +event.previousContainer.id;
              }
            });
          } else {
            console.error('No se encontró un ID de etapa de ventas correspondiente a la posición', nuevaPosition);
            transferArrayItem(containerData, previousData, event.currentIndex, event.previousIndex);
          }
        }
      
    }
  }

  private obtenerEtapas() {
    this.salesStageService.getSalesStages(1, 20, this.schema).subscribe({
      next: (respuesta) => {
        this.listas = respuesta.data.sort((a, b) => a.position - b.position);
        
        this.listas.forEach(lista => {
          this.posicionIdMap.set(lista.position, lista.id!);
        });
      },
      error: (error) => {
        console.error('Error al obtener las etapas de ventas:', error);
      }
    });
  }

  private agruparOportunidadesPorIdLista(): void {
    this.oportunidadesMap.clear();

    this.oportunidades.forEach(oportunidad => {
      const oportunidadesEnLista = this.oportunidadesMap.get(oportunidad.salesStageId) || [];
      oportunidadesEnLista.push(oportunidad);
      this.oportunidadesMap.set(oportunidad.salesStageId, oportunidadesEnLista);
    });
  }

  
  public calcularTotal(salesStageId: number): number {
    const oportunidades = this.oportunidadesMap.get(salesStageId) || [];
    return oportunidades.reduce((total, oportunidad) => total + oportunidad.baseAmount, 0);
  }
}

