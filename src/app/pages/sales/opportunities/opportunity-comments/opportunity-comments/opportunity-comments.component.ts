import { Component, Input } from '@angular/core';
import { Opportunity } from '../../../../../core/models/opportunity.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-opportunity-comments',
  standalone: true,
  imports: [MatMenuModule, ReactiveFormsModule, MatInputModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, CommonModule, MatButtonModule],
  templateUrl: './opportunity-comments.component.html',
  styleUrl: './opportunity-comments.component.scss'
})
export class OpportunityCommentsComponent {
  @Input() opportunity!: Opportunity;
}
