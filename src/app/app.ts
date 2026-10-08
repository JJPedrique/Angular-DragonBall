import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@core/layout/header/header';

// Shell de la aplicación: la barra de arriba y el hueco donde el router pinta cada página.
// No tiene estado ni lógica: eso vive en las features y en core.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// [E05] Componente raíz mínimo: header + router-outlet, sin estado ni lógica
export class App {}
