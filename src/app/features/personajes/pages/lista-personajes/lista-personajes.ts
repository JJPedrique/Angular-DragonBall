import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FavoritosService } from '@core/services/favoritos.service';
import { Paginador } from '@shared/ui/paginador/paginador';
import { FiltrosPersonajes } from '../../components/filtros-personajes/filtros-personajes';
import { PersonajeCard } from '../../components/personaje-card/personaje-card';
import { GENEROS, RAZAS } from '../../models/personaje.model';
import { PersonajesService } from '../../services/personajes.service';

// Página (componente contenedor): tiene el estado, habla con los servicios
// y le pasa datos a los componentes de presentación.
@Component({
  selector: 'app-lista-personajes',
  imports: [FiltrosPersonajes, PersonajeCard, Paginador],
  templateUrl: './lista-personajes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// [E47] Página contenedora: tiene el estado e inyecta servicios
export class ListaPersonajes {
  private readonly servicio = inject(PersonajesService);
  protected readonly favs = inject(FavoritosService);
  protected readonly razas = RAZAS;
  protected readonly generos = GENEROS;

  // Estado de la UI (signals)
  // [E48] Estado de la UI: texto, raza y página
  protected readonly texto = signal('');
  protected readonly raza = signal('todas');
  protected readonly genero = signal('todos');
  protected readonly pagina = signal(1);

  // Un solo objeto con todo lo que define la búsqueda
  // [E49] Un computed que junta todo lo que define la búsqueda
  private readonly filtro = computed(() => ({
    nombre: this.texto().trim(),
    raza: this.raza(),
    genero: this.genero(),
    pagina: this.pagina(),
  }));

  // signals -> RxJS (para debounce y switchMap) -> signal otra vez
  // [E50] toObservable -> debounceTime -> distinctUntilChanged -> switchMap -> toSignal
  private readonly respuesta = toSignal(
    toObservable(this.filtro).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((f) => this.servicio.buscar(f)),
    ),
  );

  // [E51] undefined = todavía no llegó la primera respuesta
  protected readonly cargando = (() => this.respuesta() === undefined);
  protected readonly personajes = computed(() => this.respuesta()?.items ?? []);
  protected readonly total = computed(() => this.respuesta()?.meta.totalItems ?? 0);
  protected readonly totalPaginas = computed(() => this.respuesta()?.meta.totalPages ?? 0);

  // [E52] El hijo avisa -> .set(). Si cambia el filtro, volvemos a la página 1
  protected alCambiarTexto(texto: string) {
    this.texto.set(texto);
    this.pagina.set(1); // al cambiar el filtro volvemos a la primera página
  }

  protected alCambiarRaza(raza: string) {
    this.raza.set(raza);
    this.pagina.set(1);
  }

  protected alCambiarGenero(genero : string) {
    this.genero.set(genero);
    this.pagina.set(1);
  }
}
