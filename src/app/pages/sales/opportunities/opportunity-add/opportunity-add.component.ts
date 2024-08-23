import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, finalize } from 'rxjs';
import { Contact } from '../../../../core/models/person.models';
import { Account } from '../../../../core/models/account.models';
import { Service } from '../../../../core/models/service.models';
import { PersonService } from '../../../../core/services/person.service';
import { AccountsService } from '../../../../core/services/accounts.service';
import { ServicesService } from '../../../../core/services/services.service';
import { OportunitiesService } from '../../../../core/services/opportunities.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EstadoGlobal, obtenerUsuario } from '../../../../core/reducers/estado-global.reducer';
import { Store } from '@ngrx/store';
import { OpportunityCommentsComponent } from "../opportunity-comments/opportunity-comments/opportunity-comments.component";
import { OpportunityDocumentsComponent } from "../opportunity-documents/opportunity-documents/opportunity-documents.component";
import { OpportunityContactsComponent } from "../opportunity-contacts/opportunity-contacts/opportunity-contacts.component";
import {MatTabsModule} from '@angular/material/tabs';
import { Opportunity } from '../../../../core/models/opportunity.models';
import { SalesStageService } from '../../../../core/services/sales-stage.service';
import { SalesStage } from '../../../../core/models/sales_stage.models';

@Component({
  selector: 'app-opportunity-add',
  standalone: true,
  imports: [MatInputModule, MatAutocompleteModule, MatTabsModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule, OpportunityCommentsComponent, OpportunityDocumentsComponent, OpportunityContactsComponent],
  templateUrl: './opportunity-add.component.html',
  styleUrl: './opportunity-add.component.scss'
})
export class OpportunityAddComponent {
  @Input() opportunity!: Opportunity ;
  public cargando$ = new BehaviorSubject<boolean>(false);
  public opportunityForm = this.crearFormulario();
  public contacts: Array<Contact> = [];
  public accounts: Array<Account> = [];
  public services: Array<Service> = [];
  private schema: string = '';
  public mostrarTabs = false;
  public etapas: SalesStage[] = [];
  public titulo: string = '';
  private primeraEtapa: number | null = null;
  public etapaActual: SalesStage | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformacionVentanaOportunidad,
    private readonly personService: PersonService,
    private readonly accountsService: AccountsService,
    private readonly serviceService: ServicesService,
    private readonly oportunitiesService: OportunitiesService,
    private readonly matDialogRef: MatDialogRef<OpportunityAddComponent>,
    private readonly authService: AuthService,
    private store: Store<EstadoGlobal>,
    private readonly salesStageService: SalesStageService
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.listarClientes();
    this.listarServicios();
    this.obtenerUsuario();
    this.obtenerEtapas();
    if (this.data.tipo_vista === 'editar') {
      this.asignarInformacion(this.data.opportunity!);
      this.opportunityForm.get('contactName')!.enable();
    }
  }

  private crearFormulario() {
    return new FormGroup({
      accountId: new FormControl<number | null>(null, []),
      personId: new FormControl<number | null>(null, []),
      probability: new FormControl('', []),
      currency: new FormControl('S/', []),
      baseAmount: new FormControl<number | null>(null, []),
      serviceId: new FormControl<number | null>(null, []),
      salesAgentId: new FormControl<number | null>(null, []),
      salesStageId: new FormControl<number | null>(null, []),
      accountName: new FormControl('', []),
      contactName: new FormControl({ value: '', disabled: true }, []),
      serviceName: new FormControl('', []),
    })
  }

  private asignarInformacion(informacion: Opportunity) {
    this.opportunityForm.get('accountId')?.setValue(informacion.accountId);
    this.opportunityForm.get('personId')?.setValue(informacion.personId);
    this.opportunityForm.get('probability')?.setValue(informacion.probability);
    this.opportunityForm.get('baseAmount')?.setValue(informacion.baseAmount);
    this.opportunityForm.get('serviceId')?.setValue(informacion.serviceId);
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public onToggleChange() {
    this.mostrarTabs = !this.mostrarTabs;
  }

  private obtenerEtapas() {
    this.salesStageService.getSalesStages(1, 20, this.schema).subscribe({
      next: (respuesta) => {
        this.etapas = respuesta.data.sort((a, b) => a.position - b.position);
        const stage = this.etapas.find(etapa => etapa.position === 1);
        if (stage && stage.id !== undefined) {
          this.primeraEtapa = stage.id;
        } else {
          console.warn('No se encontró una etapa de ventas con posición 1.');
          this.primeraEtapa = null;
        }

        this.etapaActual = this.etapas.find(etapa => etapa.id === this.data.opportunity!.salesStageId);
        if (!this.etapaActual) {
          console.warn('No se encontró la etapa de ventas actual para la oportunidad.');
        }
      },
      error: (error) => {
        console.error('Error al obtener las etapas de ventas:', error);
      }
    });
  }

  private obtenerUsuario() {
    this.store.select(obtenerUsuario).subscribe((usuario) => {
      if (usuario) {
        this.opportunityForm.patchValue({
          salesAgentId: usuario.id
        });
      }
    });
  }
  
  public clienteSeleccionado(account: Account) {
    this.opportunityForm.get('contactName')!.enable();
    this.opportunityForm.get('contactName')!.setValue(null);

    this.opportunityForm.get('accountId')!.setValue(account.id);
    this.opportunityForm.get('accountName')!.setValue(account.companyName);

    this.listarContacto('');
  }

  public listarContacto(nombre: string) {
    this.personService
      .getContactsByAccount(this.opportunityForm.get('accountId')!.value!, 20, this.schema)
      .subscribe((res) => {
        this.contacts = res.data;
      });
  }

  public removerCliente() {
    this.opportunityForm.get('accountId')!.setValue(null);
    this.opportunityForm.get('accountName')!.setValue('');
    this.listarClientes();
  }

  public contactoSeleccionado(contact: Contact) {
    this.opportunityForm.get('personId')!.setValue(contact.id);
    this.opportunityForm.get('contactName')!.setValue(contact.name);
  }

  public removerContacto() {
    this.opportunityForm.get('personId')!.setValue(null);
    this.opportunityForm.get('contactName')!.setValue('');
    this.listarContacto('');
  }

  private listarClientes() {
    this.accountsService.getAccounts('','',null,1,5, this.schema).subscribe((resultado) => {
      this.accounts = resultado.data;
    });
  }

  private listarServicios() {
    this.serviceService.getServices('',1,5, this.schema).subscribe((resultado) => {
      this.services = resultado.data;
    });
  }

  private crear() {
    if (this.opportunityForm.valid) {
      if (this.primeraEtapa) {
        this.opportunityForm.get('salesStageId')!.setValue(this.primeraEtapa);
      } else {
        console.error('No se puede guardar la oportunidad porque no se encontró una etapa de ventas con posición 1.');
        return;
      }
      this.cargando$.next(true);

      this.oportunitiesService
        .create(
          this.opportunityForm.value.accountId!,
          this.opportunityForm.value.personId!,
          this.opportunityForm.value.probability!,
          this.opportunityForm.value.currency!,
          Number(this.opportunityForm.value.baseAmount!),
          this.opportunityForm.value.serviceId!,
          this.opportunityForm.value.salesAgentId!,
          this.opportunityForm.value.salesStageId!,
          this.schema
        )
        .pipe(
          finalize(() => {
            this.cargando$.next(false);
          })
        )
        .subscribe({
          next: (response) => {
            this.matDialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al guardar oportunidad:', error);
           this.matDialogRef.close(false);          }
        });
    }
  }

  private actualizar() {
    if (this.opportunityForm.valid) {
      if (this.primeraEtapa) {
        this.opportunityForm.get('salesStageId')!.setValue(this.primeraEtapa);
      } else {
        console.error('No se puede guardar la oportunidad porque no se encontró una etapa de ventas con posición 1.');
        return;
      }
      this.cargando$.next(true);

      this.oportunitiesService
        .update(
          this.data.opportunity!.id,
          this.opportunityForm.value.accountId!,
          this.opportunityForm.value.personId!,
          this.opportunityForm.value.probability!,
          this.opportunityForm.value.currency!,
          Number(this.opportunityForm.value.baseAmount!),
          this.opportunityForm.value.serviceId!,
          this.opportunityForm.value.salesAgentId!,
          this.opportunityForm.value.salesStageId!,
          this.schema
        )
        .pipe(
          finalize(() => {
            this.cargando$.next(false);
          })
        )
        .subscribe({
          next: (response) => {
            this.matDialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al guardar oportunidad:', error);
           this.matDialogRef.close(false);          }
        });
    }
  }

  public guardar() {
    if (this.data.tipo_vista === 'editar') {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  public cerrarVentana() {
    this.matDialogRef.close();
  }
}

export type InformacionVentanaOportunidad = {
  tipo_vista: 'ver' | 'editar';
  opportunity?: Opportunity;
};
