import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideGlobe, LucideStar, LucideZap } from '@lucide/angular';
import { switchMap } from 'rxjs';
import { FavoritosService } from '@core/services/favoritos.service';
import { PlanetaService } from '../../services/planetas.service';

@Component({
  selector: 'app-detalle-planeta',
  imports: [RouterLink, LucideArrowLeft, LucideStar, LucideZap],
  templateUrl: './detalle-planeta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallePlaneta {
  private readonly servicio = inject(PlanetaService);
  protected readonly favs = inject(FavoritosService);

  readonly id = input.required({ transform: numberAttribute });

  protected readonly planeta = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.servicio.obtener(id))),
  );
}
