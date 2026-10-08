import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideStar, LucideZap } from '@lucide/angular';
import { FavoritosService } from '@core/services/favoritos.service';

// Barra superior: se muestra en todas las páginas, por eso vive en core/layout.
@Component({
  selector: 'app-header',
  // [E38] Standalone: el componente importa lo que usa su plantilla
  imports: [RouterLink, RouterLinkActive, LucideStar],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly titulo = signal('Directorio de Personajes');
  // [E39] El header usa el MISMO servicio que las páginas -> contador en vivo
  protected readonly favs = inject(FavoritosService);
}
