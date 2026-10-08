import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { API_URL } from '@core/config/api';
import { Pagina, unaSolaPagina } from '@shared/models/pagina.model';
import { Filtro, Planeta } from '../models/planeta.model';

// Acceso a datos: el único lugar de la app que sabe cómo se le habla a /characters.
// [E27] providedIn root: una sola instancia para toda la app
@Injectable({ providedIn: 'root' })
export class PlanetaService {
  // [E28] inject(): pedir una dependencia (antes: en el constructor)
  private readonly http = inject(HttpClient);
  // [E29] La URL sale de core/config: el servicio no repite la dirección
  private readonly url = `${API_URL}/planets`;
  private readonly porPagina = 12;

  // Sin filtros la API pagina (?page=2&limit=12).
  // Con filtros (?name=goku o ?race=Saiyan) devuelve un arreglo simple, sin paginación.
  // [E61] buscar(): con filtro manda name/race, sin filtro manda page/limit
  buscar(filtro: Filtro): Observable<Pagina<Planeta>> {
    const hayFiltro = filtro.nombre !== '' || filtro.estado !== 'todos';

    // [E62] HttpParams es inmutable: set() devuelve uno nuevo -> params = params.set()
    let params = new HttpParams();
    if (hayFiltro) {
      if (filtro.nombre) params = params.set('name', filtro.nombre);
      if (filtro.estado) params = params.set('isDestroyed',filtro.estado);
    } else {
      params = params.set('page', filtro.pagina).set('limit', this.porPagina);
    }

    return this.http.get<Pagina<Planeta> | Planeta[]>(this.url, { params }).pipe(
      map((r) => (Array.isArray(r) ? unaSolaPagina(r) : r)),
      catchError((err: HttpErrorResponse) =>
        err.status === 404 ? of(unaSolaPagina<Planeta>([])) : throwError(() => err),
      ),
    );
  }

  variosPlanetas(ids: number[]): Observable<Planeta[]> {
    return ids.length ? forkJoin(ids.map((id) => this.obtener(id))) : of([]);
  }

  obtener(id: number): Observable<Planeta> {
    return this.http.get<Planeta>(`${this.url}/${id}`);
  }  
}
