import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideSearch } from '@lucide/angular';

// Componente de presentación: el buscador y el select de raza.
// No sabe de la API ni de la paginación: recibe valores y avisa cambios.
@Component({
  selector: 'app-filtros-planetas',
  imports: [LucideSearch],
  templateUrl: './filtros-planetas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrosPlanetas {
  readonly texto = input('');
  readonly textoCambio = output<string>();
  readonly estado = input('todos');
  readonly estadoCambio = output<string>();


  protected alEscribir(evento: Event) {
    this.textoCambio.emit((evento.target as HTMLInputElement).value);
  }

  protected alElegirEstado(evento: Event) {
    this.estadoCambio.emit((evento.target as HTMLSelectElement).value);
  }
}