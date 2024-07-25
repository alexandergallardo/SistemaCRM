import { Routes } from "@angular/router";
import { SectorsListComponent } from "./sector/sectors-list/sectors-list.component";
import { ServicesListComponent } from "./service/services-list/services-list.component";
import { RolesListComponent } from "./roles/roles-list/roles-list.component";

export const SETTINGS_ROUTES: Routes = [
	{ path: 'sectors', component: SectorsListComponent },
	{ path: 'services', component: ServicesListComponent },
	{ path: 'roles', component: RolesListComponent },
];