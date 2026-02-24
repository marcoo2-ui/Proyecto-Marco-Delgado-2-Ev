import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event?: EventModel;
  loading = false;
  message = '';

  constructor(private route: ActivatedRoute, private eventsService: EventsService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message = 'Evento no encontrado.';
      return;
    }

    this.loading = true;
    this.eventsService.getEvent(id).subscribe({
      next: (response) => {
        this.event = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.message = 'No se pudo cargar el evento.';
      }
    });
  }
}
