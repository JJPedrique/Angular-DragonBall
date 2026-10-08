import { Routes } from '@angular/router';

// Rutas de la feature. En app.routes.ts se montan bajo /personajes con loadChildren.
export const PERSONAJES_ROUTES: Routes = [
  {
    // [E34] loadComponent: cada página es un archivo aparte. '' = /personajes
    path: '',
    title: 'Personajes',
    loadComponent: () => import('./pages/lista-personajes/lista-personajes').then((m) => m.ListaPersonajes),
  },
  {
    // [E35] :id -> /personajes/7. Llega a DetallePersonaje como input id()
    path: ':id',
    title: 'Detalle',
    loadComponent: () => import('./pages/detalle-personaje/detalle-personaje').then((m) => m.DetallePersonaje),
  },
];
