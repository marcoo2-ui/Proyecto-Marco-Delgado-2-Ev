import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './events-form.component.html',
  styleUrl: './events-form.component.css'
})
export class EventsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  loading = false;
  message = '';
  messageType: 'success' | 'danger' | '' = '';
  isEdit = false;
  eventId: string | null = null;

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    categoria: ['', Validators.required],
    ubicacion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    fecha: ['', Validators.required],
    esPublico: [true]
  });

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEdit = Boolean(this.eventId);
    if (this.isEdit && this.eventId) {
      this.loading = true;
      this.eventsService.getEvent(this.eventId).subscribe({
        next: (response) => {
          this.form.patchValue(response.data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.message = 'No se pudo cargar el evento.';
          this.messageType = 'danger';
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as EventModel;
    this.loading = true;

    const request$ = this.isEdit && this.eventId
      ? this.eventsService.updateEvent(this.eventId, payload)
      : this.eventsService.createEvent(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.message = this.isEdit ? 'Evento actualizado.' : 'Evento creado.';
        this.messageType = 'success';
        this.router.navigate(['/eventos']);
      },
      error: (error) => {
        this.loading = false;
        this.message = error?.error?.message || 'No se pudo guardar el evento.';
        this.messageType = 'danger';
      }
    });
  }
}
