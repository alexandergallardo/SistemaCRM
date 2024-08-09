import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { PersonService } from '../../../../core/services/person.service';
import { Lead } from '../../../../core/models/person.models';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LEAD_ETAPAS_KEYS, obtenerEtapa } from '../../../../shared/utils/stages.utils';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-leads-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, HttpClientModule, RouterModule, MatToolbarModule],
  templateUrl: './leads-view.component.html',
  styleUrl: './leads-view.component.scss'
})
export class LeadsViewComponent implements OnInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public lead!: Lead;
  public readonly etapasKeys = LEAD_ETAPAS_KEYS;
  public obtenerEtapa = obtenerEtapa;
  public selectedEtapa: string | null = null;
  private schema: string = '';

  constructor (
    private readonly activatedRoute: ActivatedRoute,
    private readonly personService: PersonService,
    private readonly location: Location,
    private readonly authService: AuthService,
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.activatedRoute.paramMap.subscribe((param) => {
      const leadId = param.get('leadId');
        this.obtenerLead(Number(leadId));
    });
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public obtenerLead(id: number): void {
    this.cargando$.next(true);

    this.personService
      .getOneLead(id, this.schema)
      .pipe(
        finalize(() => {
          this.cargando$.next(false);
        }),
      )
      .subscribe((response) => {
        this.lead = response.data;
        this.selectedEtapa = this.lead.leadStatus;
      });
  }

  public goBack(): void {
    this.location.back();
  }

  handleLeadStatusAction(): void {
    if (this.lead && this.selectedEtapa) {
      if (this.selectedEtapa === this.obtenerSiguienteEtapa(this.lead.leadStatus)) {
        this.lead.leadStatus = this.selectedEtapa;
        this.selectedEtapa = this.obtenerSiguienteEtapa(this.selectedEtapa);
      } else {
        this.lead.leadStatus = this.selectedEtapa;
        this.selectedEtapa = this.obtenerSiguienteEtapa(this.selectedEtapa);
      }
    }
  }

  seleccionarEtapa(etapa: string): void {
    this.selectedEtapa = etapa;
  }

  etapaCompleta(estadoActual: string, etapa: string): boolean {
    const estadoActualIndex = this.etapasKeys.indexOf(estadoActual);
    const etapaIndex = this.etapasKeys.indexOf(etapa);
    return estadoActualIndex >= etapaIndex;
  }

  etapaActual(estadoActual: string, etapa: string): boolean {
    const estadoActualIndex = this.etapasKeys.indexOf(estadoActual);
    const etapaIndex = this.etapasKeys.indexOf(etapa);
    return estadoActualIndex + 1 === etapaIndex;
  }

  etapaSeleccionada(etapa: string): boolean {
    return this.selectedEtapa === etapa;
  }

  obtenerSiguienteEtapa(estadoActual: string): string | null {
    const estadoActualIndex = this.etapasKeys.indexOf(estadoActual);
    return this.etapasKeys[estadoActualIndex + 1] || null;
  }

  getActionButtonText(): string {
    return this.selectedEtapa === this.obtenerSiguienteEtapa(this.lead?.leadStatus ?? '') 
      ? 'Marcar estado como completado' 
      : 'Marcar como estado actual';
  }
}
