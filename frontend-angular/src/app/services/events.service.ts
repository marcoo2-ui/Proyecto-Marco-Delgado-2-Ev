import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, timeout } from 'rxjs';
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

    return '/api/v1';
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

  private async fetchJsonWithFallback<T>(primaryUrl: string, fallbackUrl: string): Promise<T> {
    const urls = primaryUrl === fallbackUrl ? [primaryUrl] : [primaryUrl, fallbackUrl];
    let lastError: unknown;

    for (const url of urls) {
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as T;
        clearTimeout(timeoutHandle);
        return json;
      } catch (error) {
        clearTimeout(timeoutHandle);
        lastError = error;
      }
    }

    throw lastError ?? new Error('No se pudo obtener respuesta de la API');
  }

  getEvents(params: { page: number; limit: number; categoria?: string; q?: string }): Observable<EventListResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit)
    });

    if (params.categoria) {
      searchParams.set('categoria', params.categoria);
    }
    if (params.q) {
      searchParams.set('q', params.q);
    }

    const query = searchParams.toString();
    const primaryUrl = `${this.baseUrl}/eventos/get/all?${query}`;
    const fallbackUrl = `${this.fallbackBaseUrl}/eventos/get/all?${query}`;

    return from(this.fetchJsonWithFallback<EventListResponse>(primaryUrl, fallbackUrl));
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
