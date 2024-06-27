import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Opportunity } from '../../../../../core/models/opportunity.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opportunity-list-table',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './opportunity-list-table.component.html',
  styleUrl: './opportunity-list-table.component.scss'
})
export class OpportunityListTableComponent {
  @Input() oportunidades: Opportunity[] = [];
  @Input() totalRegistros!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns = ['accountName', 'personName', 'serviceName', 'baseAmount', 'probability', 'salesStageName', 'salesAgentName', 'options'];
}
