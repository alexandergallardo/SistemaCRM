  import { Component, EventEmitter, OnInit, Output } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { SalesStageService } from '../../../core/services/sales-stage.service';
  import { MatDialogRef } from '@angular/material/dialog';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { SalesStage } from '../../../core/models/sales_stage.models';
  import { BehaviorSubject } from 'rxjs';
  import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
  import { MatCardModule } from '@angular/material/card';
  import { CommonModule } from '@angular/common';
  import { DragDropModule } from '@angular/cdk/drag-drop';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { AuthService } from '../../../core/services/auth.service';
  import { MatInputModule } from '@angular/material/input';

  @Component({
    selector: 'app-sales-stage',
    standalone: true,
    imports: [MatIconModule, MatFormFieldModule, MatInputModule,ReactiveFormsModule, MatCardModule, CommonModule, DragDropModule, MatButtonModule],
    templateUrl: './sales-stage.component.html',
    styleUrl: './sales-stage.component.scss'
  })
  export class SalesStageComponent implements OnInit {
    @Output() etapasGuardadas = new EventEmitter<void>();

  public formControl = new FormControl<string>('');
  public listas: SalesStage[] = [];
  public schema: string = '';
  public opcionesPredeterminadas: SalesStage[] = [
    { name: 'Oportunidad', position: 0 },
    { name: 'Prospecto', position: 0 },
    { name: 'Contactado', position: 0 },
    { name: 'Por cotizar', position: 0 },
    { name: 'Propuesta enviada', position: 0 },
    { name: 'Cotizado', position: 0 },
    { name: 'Negociación', position: 0 },
    { name: 'Cerrado', position: 0 },
    { name: 'Cerrado con venta', position: 0 },
    { name: 'Cerrado sin venta', position: 0 }
  ];
  public cargando$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly salesStageService: SalesStageService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.inicializarSchema();
  }

  public agregarEtapaPersonalizada() {
    const nombreEtapa = this.formControl.value;
    if (nombreEtapa) {
      const nuevaEtapa: SalesStage = {
        name: nombreEtapa,
        position: this.listas.length + 1,
      };
      this.listas.push(nuevaEtapa);
      this.formControl.reset();
    }
  }

  public agregarDesdeOpcionesPredeterminadas(opcion: SalesStage) {
    const nuevaEtapa: SalesStage = {
      name: opcion.name,
      position: this.listas.length + 1,
    };
    this.listas.push(nuevaEtapa);
    this.eliminarDeOpcionesPredeterminadas(opcion.name);
  }

  private eliminarDeOpcionesPredeterminadas(name: string) {
    const index = this.opcionesPredeterminadas.findIndex(etapa => etapa.name === name);
    if (index > -1) {
      this.opcionesPredeterminadas.splice(index, 1);
    }
  }

  public eliminarEtapa(index: number) {
    const etapa = this.listas[index];
    this.listas.splice(index, 1);
    if (this.opcionesPredeterminadas.some(opcion => opcion.name === etapa.name)) {
      this.opcionesPredeterminadas.push(etapa);
    }
    this.listas.forEach((etapa, i) => {
      etapa.position = i + 1;
    });
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public drop(event: CdkDragDrop<SalesStage[]>) {
    moveItemInArray(this.listas, event.previousIndex, event.currentIndex);
    this.listas.forEach((etapa, index) => {
      etapa.position = index + 1;
    });
  }

  public guardarEtapas(schema: string) {
    this.cargando$.next(true);
  
    const etapasOrdenadas = this.listas.map(etapa => ({
      name: etapa.name,
      position: etapa.position,
      schema: schema
    }));

    this.salesStageService.createMultiple(etapasOrdenadas).subscribe({
      next: () => {
        this.etapasGuardadas.emit();
        this.cargando$.next(false);
      },
      error: (error) => {
        console.error('Error al crear las etapas de venta:', error);
        this.cargando$.next(false);
      }
    });
  }
}
