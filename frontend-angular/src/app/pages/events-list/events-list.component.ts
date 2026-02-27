import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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

  constructor(
    private eventsService: EventsService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  private clearLoadingGuard(): void {
    if (this.loadingGuardTimeout) {
      clearTimeout(this.loadingGuardTimeout);
      this.loadingGuardTimeout = undefined;
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  private renderEventsDom(events: EventModel[], total: number, totalPages: number): void {
    const totalElement = document.getElementById('total-events');
    if (totalElement) {
      totalElement.textContent = String(total);
    }

    const pagesElement = document.getElementById('total-pages');
    if (pagesElement) {
      pagesElement.textContent = String(totalPages);
    }

    const tbody = document.getElementById('events-tbody');
    if (!tbody) {
      return;
    }

    if (!events.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay eventos disponibles.</td></tr>';
      return;
    }

    const rows = events
      .map((event) => {
        const id = this.escapeHtml(event._id || '');
        const titulo = this.escapeHtml(event.titulo || '');
        const categoria = this.escapeHtml(event.categoria || '');
        const fecha = event.fecha ? new Date(event.fecha).toLocaleDateString('es-ES') : '-';
        const precio = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(event.precio || 0);
        const estadoClass = event.esPublico ? 'bg-success' : 'bg-secondary';
        const estadoText = event.esPublico ? 'Público' : 'Privado';

        return `
          <tr>
            <td>${titulo}</td>
            <td>${categoria}</td>
            <td>${fecha}</td>
            <td>${precio}</td>
            <td><span class="badge ${estadoClass}">${estadoText}</span></td>
            <td class="text-end">
              <a class="btn btn-sm btn-outline-primary me-2" href="/eventos/${id}">Ver</a>
              <a class="btn btn-sm btn-outline-secondary me-2" href="/eventos/${id}/editar">Editar</a>
            </td>
          </tr>
        `;
      })
      .join('');

    tbody.innerHTML = rows;
  }

  private startLoadingGuard(): void {
    this.clearLoadingGuard();
    this.loadingGuardTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        if (!this.loading) {
          return;
        }

        this.loading = false;
        this.message = 'La carga tardó demasiado. Reintentando con conexión alternativa...';
        this.messageType = 'danger';
        this.cdr.detectChanges();
        this.loadEventsDirectFallback();
      });
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
        this.ngZone.run(() => {
          this.events = response.data || [];
          this.total = response.meta?.total ?? this.events.length;
          this.totalPages = response.meta?.totalPages || 1;
          this.message = '';
          this.messageType = '';
          this.renderEventsDom(this.events, this.total, this.totalPages);
          this.cdr.detectChanges();
        });
      })
      .catch(() => {
        this.ngZone.run(() => {
          this.message = 'No se pudieron cargar los eventos.';
          this.messageType = 'danger';
          this.cdr.detectChanges();
        });
      });
  }

  loadEvents(): void {
    this.loading = true;
    this.startLoadingGuard();
    this.eventsService
      .getEvents({ page: this.page, limit: this.limit, categoria: this.categoria || undefined, q: this.search || undefined })
      .pipe(
        finalize(() => {
          this.ngZone.run(() => {
            this.loading = false;
            this.clearLoadingGuard();
            this.cdr.detectChanges();
          });
        })
      )
      .subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            this.events = response.data || [];
            this.total = response.meta?.total ?? this.events.length;
            this.totalPages = response.meta?.totalPages || 1;
            this.renderEventsDom(this.events, this.total, this.totalPages);
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.message = 'No se pudieron cargar los eventos.';
            this.messageType = 'danger';
            this.cdr.detectChanges();
          });
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
