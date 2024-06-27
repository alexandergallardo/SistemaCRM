import { Routes } from "@angular/router";
import { OpportunityListComponent } from "./opportunities/opportunity-list/opportunity-list.component";
import { AccountsListComponent } from "./account/accounts-list/accounts-list.component";
import { ContactsListComponent } from "./contact/contacts-list/contacts-list.component";

export const SALES_ROUTES: Routes = [
	{ path: 'accounts', component: AccountsListComponent },
	{ path: 'contacts', component: ContactsListComponent },
 	{ path: 'opportunities', component: OpportunityListComponent },
];