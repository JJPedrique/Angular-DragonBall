import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideImageOff, LucideStar } from '@lucide/angular';
import { Planeta } from '../../models/planeta.model';

@Component({
  selector: 'app-planeta-card',
  host: { class: 'mb-4 block break-inside-avoid' },
  imports: [RouterLink, LucideImageOff, LucideStar],
  templateUrl: './planeta-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlanetaCard {

  readonly planeta = input.required<Planeta>();
  readonly esFavorito = input(false);

  readonly favoritoCambiado = output<number>();
  protected readonly imagenFallo = signal(false);

  protected marcar() {
    this.favoritoCambiado.emit(this.planeta().id);
  }
}
