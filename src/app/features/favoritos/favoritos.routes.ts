import { Routes } from '@angular/router';

export const FAVORITOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Favoritos',
    loadComponent: () => import('./pages/mis-favoritos/mis-favoritos').then((m) => m.MisFavoritos),
  },
];
