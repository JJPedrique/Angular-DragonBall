import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { API_URL } from '@core/config/api';
import { Pagina, unaSolaPagina } from '@shared/models/pagina.model';
import { Filtro, Personaje, PersonajeDetalle } from '../models/personaje.model';

// Acceso a datos: el único lugar de la app que sabe cómo se le habla a /characters.
// [E27] providedIn root: una sola instancia para toda la app
@Injectable({ providedIn: 'root' })
export class PersonajesService {
  // [E28] inject(): pedir una dependencia (antes: en el constructor)
  private readonly http = inject(HttpClient);
  // [E29] La URL sale de core/config: el servicio no repite la dirección
  private readonly url = `${API_URL}/characters`;
  private readonly porPagina = 12;

  // Sin filtros la API pagina (?page=2&limit=12).
  // Con filtros (?name=goku o ?race=Saiyan) devuelve un arreglo simple, sin paginación.
  // [E61] buscar(): con filtro manda name/race, sin filtro manda page/limit
  buscar(filtro: Filtro): Observable<Pagina<Personaje>> {
    const hayFiltro = filtro.nombre !== '' || filtro.raza !== 'todas' || filtro.genero !== 'todos';

    // [E62] HttpParams es inmutable: set() devuelve uno nuevo -> params = params.set()
    let params = new HttpParams();
    if (hayFiltro) {
      if (filtro.nombre) params = params.set('name', filtro.nombre);
      if (filtro.raza !== 'todas') params = params.set('race', filtro.raza);
      if (filtro.genero !== 'todos') params = params.set('gender', filtro.genero);
    } else {
      params = params.set('page', filtro.pagina).set('limit', this.porPagina);
    }

    return this.http.get<Pagina<Personaje> | Personaje[]>(this.url, { params }).pipe(
      // [E63] map: las dos formas de respuesta quedan como Pagina<Personaje>
      map((r) => (Array.isArray(r) ? unaSolaPagina(r) : r)),
      // [E64] catchError: 404 -> página vacía; cualquier otro error se relanza
      // Si la API responde 404 lo tratamos como "sin resultados"
      catchError((err: HttpErrorResponse) =>
        err.status === 404 ? of(unaSolaPagina<Personaje>([])) : throwError(() => err),
      ),
    );
  }

  // Varios personajes a la vez: una petición por id, en paralelo
  // [E66] forkJoin: N peticiones en paralelo, emite cuando terminan todas
  variosPersonajes(ids: number[]): Observable<Personaje[]> {
    return ids.length ? forkJoin(ids.map((id) => this.obtener(id))) : of([]);
  }

  // [E30] http.get devuelve un Observable: la petición sale recién al suscribirse
  obtener(id: number): Observable<PersonajeDetalle> {
    return this.http.get<PersonajeDetalle>(`${this.url}/${id}`);
  }
}
