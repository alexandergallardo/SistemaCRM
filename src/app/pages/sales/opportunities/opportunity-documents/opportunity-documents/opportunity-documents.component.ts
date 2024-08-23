import { Component, Input } from '@angular/core';
import { Opportunity } from '../../../../../core/models/opportunity.models';

@Component({
  selector: 'app-opportunity-documents',
  standalone: true,
  imports: [],
  templateUrl: './opportunity-documents.component.html',
  styleUrl: './opportunity-documents.component.scss'
})
export class OpportunityDocumentsComponent {
  @Input() opportunity!: Opportunity;

}
