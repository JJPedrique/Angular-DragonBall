import { Routes } from '@angular/router';

// Rutas de la feature. En app.routes.ts se montan bajo /personajes con loadChildren.
export const PLANETAS_ROUTES: Routes = [
  {
    // [E34] loadComponent: cada página es un archivo aparte. '' = /personajes
    path: '',
    title: 'Planeta',
    loadComponent: () => import('./pages/lista-planetas/lista-planetas').then((m) => m.ListaPlanetas),
  },
  {
    // [E35] :id -> /personajes/7. Llega a DetallePersonaje como input id()
    path: ':id',
    title: 'Detalle',
    loadComponent: () => import('./pages/detalle-planeta/detalle-planeta').then((m) => m.DetallePlaneta),
  },
];
