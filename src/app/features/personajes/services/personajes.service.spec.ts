import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PersonajesService } from './personajes.service';

describe('PersonajesService', () => {
  let servicio: PersonajesService;
  let http: HttpTestingController;

  beforeEach(() => {
    // [E76] HttpClient de pruebas: ninguna petición sale a internet
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(PersonajesService);
    http = TestBed.inject(HttpTestingController);
  });

  // [E77] verify(): falla si quedó una petición sin responder
  afterEach(() => http.verify());

  it('sin filtros pide la página y el límite', () => {
    servicio.buscar({ pagina: 2, nombre: '', raza: 'todas', genero:'todos' }).subscribe();
    // [E78] expectOne atrapa la petición, flush le responde con datos falsos
    const req = http.expectOne((r) => r.url.endsWith('/characters'));
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('12');
    expect(req.request.params.has('name')).toBe(false);
    req.flush({ items: [], meta: { totalItems: 0, itemCount: 0, itemsPerPage: 12, totalPages: 0, currentPage: 2 } });
  });

  it('con filtro manda name y race, y convierte el arreglo en una página', () => {
    let total = -1;
    servicio.buscar({ pagina: 1, nombre: 'goku', raza: 'Saiyan', genero: 'Male' }).subscribe((r) => (total = r.meta.totalItems));
    const req = http.expectOne((r) => r.url.endsWith('/characters'));
    expect(req.request.params.get('name')).toBe('goku');
    expect(req.request.params.get('race')).toBe('Saiyan');
    expect(req.request.params.has('page')).toBe(false);
    req.flush([{ id: 1, name: 'Goku' }]);
    expect(total).toBe(1);
  });

  it('un 404 se convierte en cero resultados', () => {
    let total = -1;
    servicio.buscar({ pagina: 1, nombre: 'zzz', raza: 'todas', genero: 'todos'}).subscribe((r) => (total = r.meta.totalItems));
    // [E79] flush con status 404 simula el error
    http.expectOne(() => true).flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    expect(total).toBe(0);
  });

  it('varios() hace una petición por id', () => {
    let nombres: string[] = [];
    servicio.variosPersonajes([1, 2]).subscribe((r) => (nombres = r.map((p) => p.name)));
    http.expectOne((r) => r.url.endsWith('/characters/1')).flush({ id: 1, name: 'Goku' });
    http.expectOne((r) => r.url.endsWith('/characters/2')).flush({ id: 2, name: 'Vegeta' });
    expect(nombres).toEqual(['Goku', 'Vegeta']);
  });
});
