import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideGlobe, LucideStar, LucideZap } from '@lucide/angular';
import { switchMap } from 'rxjs';
import { FavoritosService } from '@core/services/favoritos.service';
import { PersonajesService } from '../../services/personajes.service';

@Component({
  selector: 'app-detalle-personaje',
  imports: [RouterLink, LucideArrowLeft, LucideGlobe, LucideStar, LucideZap],
  templateUrl: './detalle-personaje.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallePersonaje {
  private readonly servicio = inject(PersonajesService);
  protected readonly favs = inject(FavoritosService);

  // Llega desde la URL /personajes/:id gracias a withComponentInputBinding()
  // [E43] El :id de la URL llega como input. numberAttribute: '3' -> 3
  readonly id = input.required({ transform: numberAttribute });

  // Cada vez que cambia el id, cancelamos la petición anterior y pedimos la nueva
  // [E44] Cambia el id -> switchMap cancela la petición anterior y pide la nueva
  protected readonly personaje = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.servicio.obtener(id))),
  );
}
