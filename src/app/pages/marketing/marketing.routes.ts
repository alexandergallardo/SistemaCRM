import { Routes } from "@angular/router";
import { CampaignsComponent } from "./campaigns/campaigns.component";
import { LeadsListComponent } from "./lead/leads-list/leads-list.component";
import { LeadsViewComponent } from "./lead/leads-view/leads-view.component";

export const MARKETING_ROUTES: Routes = [
	{ path: 'leads', component: LeadsListComponent },
	{ path: 'leads/:leadId', component: LeadsViewComponent },
	{ path: 'campaigns', component: CampaignsComponent },
];