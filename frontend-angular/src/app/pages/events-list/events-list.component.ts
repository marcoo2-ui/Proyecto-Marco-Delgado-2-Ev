import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { EventModel } from '../../models/event.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent implements OnInit {
  events: EventModel[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'danger' | '' = '';
  private loadingGuardTimeout?: ReturnType<typeof setTimeout>;

  page = 1;
  limit = 6;
  totalPages = 1;
  total = 0;
  search = '';
  categoria = '';

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  private clearLoadingGuard(): void {
    if (this.loadingGuardTimeout) {
      clearTimeout(this.loadingGuardTimeout);
      this.loadingGuardTimeout = undefined;
    }
  }

  private startLoadingGuard(): void {
    this.clearLoadingGuard();
    this.loadingGuardTimeout = setTimeout(() => {
      if (!this.loading) {
        return;
      }

      this.loading = false;
      this.message = 'La carga tardó demasiado. Reintentando con conexión alternativa...';
      this.messageType = 'danger';
      this.loadEventsDirectFallback();
    }, 10000);
  }

  private loadEventsDirectFallback(): void {
    const params = new URLSearchParams({
      page: String(this.page),
      limit: String(this.limit)
    });

    if (this.categoria) {
      params.set('categoria', this.categoria);
    }
    if (this.search) {
      params.set('q', this.search);
    }

    fetch(`/api/v1/eventos/get/all?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar eventos');
        }
        return response.json();
      })
      .then((response: { data?: EventModel[]; meta?: { total?: number; totalPages?: number } }) => {
        this.events = response.data || [];
        this.total = response.meta?.total ?? this.events.length;
        this.totalPages = response.meta?.totalPages || 1;
        this.message = '';
        this.messageType = '';
      })
      .catch(() => {
        this.message = 'No se pudieron cargar los eventos.';
        this.messageType = 'danger';
      });
  }

  loadEvents(): void {
    this.loading = true;
    this.startLoadingGuard();
    this.eventsService
      .getEvents({ page: this.page, limit: this.limit, categoria: this.categoria || undefined, q: this.search || undefined })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.clearLoadingGuard();
        })
      )
      .subscribe({
        next: (response) => {
          this.events = response.data || [];
          this.total = response.meta?.total ?? this.events.length;
          this.totalPages = response.meta?.totalPages || 1;
        },
        error: () => {
          this.message = 'No se pudieron cargar los eventos.';
          this.messageType = 'danger';
        }
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadEvents();
  }

  clearFilters(): void {
    this.search = '';
    this.categoria = '';
    this.applyFilters();
  }

  changePage(delta: number): void {
    const nextPage = this.page + delta;
    if (nextPage < 1 || nextPage > this.totalPages) {
      return;
    }
    this.page = nextPage;
    this.loadEvents();
  }

  deleteEvent(id?: string): void {
    if (!id) {
      return;
    }
    this.loading = true;
    this.eventsService.deleteEvent(id).subscribe({
      next: (response) => {
        this.message = response.message;
        this.messageType = 'success';
        this.loadEvents();
      },
      error: () => {
        this.loading = false;
        this.message = 'No se pudo eliminar el evento.';
        this.messageType = 'danger';
      }
    });
  }
}
