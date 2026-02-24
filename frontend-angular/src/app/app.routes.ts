import { Routes } from '@angular/router';
import { EventsListComponent } from './pages/events-list/events-list.component';
import { EventsFormComponent } from './pages/events-form/events-form.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'eventos', pathMatch: 'full' },
	{ path: 'eventos', component: EventsListComponent },
	{ path: 'eventos/nuevo', component: EventsFormComponent },
	{ path: 'eventos/:id/editar', component: EventsFormComponent },
	{ path: 'eventos/:id', component: EventDetailComponent },
	{ path: '**', redirectTo: 'eventos' }
];
