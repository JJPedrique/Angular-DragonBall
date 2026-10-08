import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideSearch } from '@lucide/angular';

// Componente de presentación: el buscador y el select de raza.
// No sabe de la API ni de la paginación: recibe valores y avisa cambios.
@Component({
  selector: 'app-filtros-personajes',
  imports: [LucideSearch],
  templateUrl: './filtros-personajes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrosPersonajes {
  // [E54] Presentación: solo input() y output(), no inyecta servicios
  readonly texto = input('');
  readonly raza = input('todas');
  readonly razas = input.required<string[]>();
  readonly genero = input('todos');
  readonly generos = input.required<string[]>();

  readonly textoCambio = output<string>();
  readonly razaCambio = output<string>();
  readonly generoCambio = output<string>();

  // [E55] Lee el valor del DOM y lo emite hacia la página
  protected alEscribir(evento: Event) {
    this.textoCambio.emit((evento.target as HTMLInputElement).value);
  }

  protected alElegirRaza(evento: Event) {
    this.razaCambio.emit((evento.target as HTMLSelectElement).value);
  }

  protected alElegirGenero(evento: Event) {
    this.generoCambio.emit((evento.target as HTMLSelectElement).value);
  }
}
