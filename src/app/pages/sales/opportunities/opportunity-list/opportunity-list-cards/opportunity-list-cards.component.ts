import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { Opportunity } from '../../../../../core/models/opportunity.models';
import { OpportunityCardComponent } from '../../opportunity-card/opportunity-card.component';
import { SalesStage } from '../../../../../core/models/sales_stage.models';
import { OportunitiesService } from '../../../../../core/services/opportunities.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
  public oportunidadesMap: Map<number, Opportunity[]> = new Map<number, Opportunity[]>();

  constructor(private oportunitiesService: OportunitiesService) {}

  ngOnInit(): void {
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
          const nuevaIdLista = +event.container.id;
  
          transferArrayItem(previousData, containerData, event.previousIndex, event.currentIndex);
          oportunidad.salesStageId = nuevaIdLista;

          this.oportunitiesService.updateOpportunityStage(oportunidad.id, nuevaIdLista).subscribe({
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
        }
      
    }
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

