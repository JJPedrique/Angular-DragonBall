import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { FavoritosService } from '@core/services/favoritos.service';
// [E67] Otra feature: se usan sus components/ y services/, nunca sus pages/
import { PersonajeCard } from '@features/personajes/components/personaje-card/personaje-card';
import { PersonajesService } from '@features/personajes/services/personajes.service';
import { PlanetaCard } from '@features/planetas/components/planeta-card/planeta-card';
import { PlanetaService } from '@features/planetas/services/planetas.service';

@Component({
  selector: 'app-mis-favoritos',
  imports: [PersonajeCard, PlanetaCard, RouterLink],
  templateUrl: './mis-favoritos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// Una página puede usar componentes y servicios de otra feature,
// pero nunca sus páginas (esas solo las carga el router).
export class MisFavoritos {
  private readonly personajeServicio = inject(PersonajesService);
  private readonly planetaServicio = inject(PlanetaService);
  protected readonly favs = inject(FavoritosService);

  // [E68] ids de favoritos -> varios(ids). initialValue evita el undefined
  protected readonly personajes = toSignal(
    toObservable(this.favs.personajesFavoritos).pipe(switchMap((ids) => this.personajeServicio.variosPersonajes(ids))),
    { initialValue: [] },
  );

  protected readonly planetas = toSignal(
    toObservable(this.favs.planetasFavoritos).pipe(switchMap((ids) => this.planetaServicio.variosPlanetas(ids))),
    { initialValue: [] },
  );
}
