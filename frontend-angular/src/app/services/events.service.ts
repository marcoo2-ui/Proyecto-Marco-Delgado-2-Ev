import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, timeout } from 'rxjs';
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
  private readonly baseUrl = this.resolveBaseUrl();
  private readonly fallbackBaseUrl = 'https://backend-zeta-ten-49.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  private resolveBaseUrl(): string {
    const runtimeBaseUrl = (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__;
    if (runtimeBaseUrl) {
      return runtimeBaseUrl;
    }

    const hostname = globalThis.location?.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000/api/v1';
    }

    return 'https://backend-zeta-ten-49.vercel.app/api/v1';
  }

  private withFallback<T>(request: (baseUrl: string) => Observable<T>): Observable<T> {
    const primary$ = request(this.baseUrl).pipe(timeout(15000));

    if (this.baseUrl === this.fallbackBaseUrl) {
      return primary$;
    }

    return primary$.pipe(
      catchError(() => request(this.fallbackBaseUrl).pipe(timeout(15000)))
    );
  }

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

    return this.withFallback((baseUrl) =>
      this.http.get<EventListResponse>(`${baseUrl}/eventos/get/all`, { params: httpParams })
    );
  }

  getEvent(id: string): Observable<{ data: EventModel }> {
    return this.withFallback((baseUrl) =>
      this.http.get<{ data: EventModel }>(`${baseUrl}/eventos/get/${id}`)
    );
  }

  createEvent(payload: EventModel): Observable<{ data: EventModel; message: string }> {
    return this.withFallback((baseUrl) =>
      this.http.post<{ data: EventModel; message: string }>(`${baseUrl}/eventos/post`, payload)
    );
  }

  updateEvent(id: string, payload: EventModel): Observable<{ data: EventModel; message: string }> {
    return this.withFallback((baseUrl) =>
      this.http.put<{ data: EventModel; message: string }>(`${baseUrl}/eventos/update/${id}`, payload)
    );
  }

  deleteEvent(id: string): Observable<{ message: string }> {
    return this.withFallback((baseUrl) =>
      this.http.delete<{ message: string }>(`${baseUrl}/eventos/delete/${id}`)
    );
  }
}
