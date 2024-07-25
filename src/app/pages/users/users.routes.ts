import { Routes } from "@angular/router";
import { UsersListComponent } from "./user/users-list/users-list.component";

export const USERS_ROUTES: Routes = [
	{ path: '', component: UsersListComponent },
];