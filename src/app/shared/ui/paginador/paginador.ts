import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

// Componente de presentación reutilizable: no sabe qué se pagina.
// Recibe la página actual y el total, y avisa a qué página se quiere ir.
@Component({
  selector: 'app-paginador',
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './paginador.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginador {
  // [E59] Componente de shared/: no sabe qué se pagina
  readonly pagina = input.required<number>();
  readonly totalPaginas = input.required<number>();

  readonly cambio = output<number>();

  protected ir(delta: number) {
    this.cambio.emit(this.pagina() + delta);
  }
}
