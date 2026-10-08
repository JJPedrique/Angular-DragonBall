import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FavoritosService } from '@core/services/favoritos.service';
import { Paginador } from '@shared/ui/paginador/paginador';
import { FiltrosPlanetas } from '../../components/filtros-planetas/filtros-planetas';
import { PlanetaCard } from '../../components/planeta-card/planeta-card';
import { PlanetaService } from '../../services/planetas.service';

@Component({
  selector: 'app-lista-personajes',
  imports: [FiltrosPlanetas, PlanetaCard, Paginador],
  templateUrl: './lista-planetas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ListaPlanetas {
  private readonly servicio = inject(PlanetaService);
  protected readonly favs = inject(FavoritosService);

  protected readonly texto = signal('');
  protected readonly pagina = signal(1);
  protected readonly estado = signal('todos');

  private readonly filtro = computed(() => ({
    nombre: this.texto().trim(),
    pagina: this.pagina(),
    estado: this.estado()
  }));

  private readonly respuesta = toSignal(
    toObservable(this.filtro).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((f) => this.servicio.buscar(f)),
    ),
  );

  protected readonly cargando = computed(() => this.respuesta() === undefined);
  protected readonly planetas = computed(() => this.respuesta()?.items ?? []);
  protected readonly total = computed(() => this.respuesta()?.meta.totalItems ?? 0);
  protected readonly totalPaginas = computed(() => this.respuesta()?.meta.totalPages ?? 0);

  protected alCambiarTexto(texto: string) {
    this.texto.set(texto);
    this.pagina.set(1); 
  }

  protected alCambiarEstado(estado: string){
    this.estado.set(estado);
    this.pagina.set(1);
  }
}
