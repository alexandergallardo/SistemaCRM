import { Component, Input } from '@angular/core';
import { Opportunity } from '../../../../../core/models/opportunity.models';

@Component({
  selector: 'app-opportunity-contacts',
  standalone: true,
  imports: [],
  templateUrl: './opportunity-contacts.component.html',
  styleUrl: './opportunity-contacts.component.scss'
})
export class OpportunityContactsComponent {
  @Input() opportunity!: Opportunity;

}
