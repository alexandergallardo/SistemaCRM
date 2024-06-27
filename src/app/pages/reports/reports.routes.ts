import { Routes } from "@angular/router";
import { ChartsComponent } from "./charts/charts.component";
import { CalendarComponent } from "./calendar/calendar.component";


export const REPORTS_ROUTES: Routes = [
	{ path: 'charts', component: ChartsComponent },
	{ path: 'calendar', component: CalendarComponent },
];