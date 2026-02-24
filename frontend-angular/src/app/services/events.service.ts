import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event.model';

interface EventListResponse {
  data: EventModel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'http://localhost:4000/api/v1';

  constructor(private http: HttpClient) {}

  getEvents(params: { page: number; limit: number; categoria?: string; q?: string }): Observable<EventListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('limit', params.limit);

    if (params.categoria) {
      httpParams = httpParams.set('categoria', params.categoria);
    }
    if (params.q) {
      httpParams = httpParams.set('q', params.q);
    }

    return this.http.get<EventListResponse>(`${this.baseUrl}/eventos/get/all`, { params: httpParams });
  }

  getEvent(id: string): Observable<{ data: EventModel }> {
    return this.http.get<{ data: EventModel }>(`${this.baseUrl}/eventos/get/${id}`);
  }

  createEvent(payload: EventModel): Observable<{ data: EventModel; message: string }> {
    return this.http.post<{ data: EventModel; message: string }>(`${this.baseUrl}/eventos/post`, payload);
  }

  updateEvent(id: string, payload: EventModel): Observable<{ data: EventModel; message: string }> {
    return this.http.put<{ data: EventModel; message: string }>(`${this.baseUrl}/eventos/update/${id}`, payload);
  }

  deleteEvent(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/eventos/delete/${id}`);
  }
}
