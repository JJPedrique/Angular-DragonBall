import { Routes } from '@angular/router';

// Rutas de primer nivel: cada feature trae sus propias rutas y se carga diferida.
export const routes: Routes = [
  // [E31] Ruta vacía -> redirige. pathMatch 'full': solo si la URL es exactamente ''
  { path: '', redirectTo: 'personajes', pathMatch: 'full' },
  {
    // [E32] loadChildren: la feature trae sus propias rutas y se descarga al entrar
    path: 'personajes',
    loadChildren: () => import('./features/personajes/personajes.routes').then((m) => m.PERSONAJES_ROUTES),
  },
  {
    path: 'planetas',
    loadChildren: () => import('./features/planetas/planetas.routes').then((m) => m.PLANETAS_ROUTES),
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./features/favoritos/favoritos.routes').then((m) => m.FAVORITOS_ROUTES),
  },
  {
    path: 'sugerir',
    loadChildren: () => import('./features/sugerencias/sugerencias.routes').then((m) => m.SUGERENCIAS_ROUTES),
  },
  {
    // [E33] '**' atrapa cualquier URL que no exista. Siempre al final
    path: '**',
    title: 'No encontrada',
    loadComponent: () => import('./core/layout/no-encontrada/no-encontrada').then((m) => m.NoEncontrada),
  },
];
