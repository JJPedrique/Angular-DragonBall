import { Routes } from '@angular/router';

export const SUGERENCIAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Sugerir personaje',
    loadComponent: () => import('./pages/sugerir-personaje/sugerir-personaje').then((m) => m.SugerirPersonaje),
  },
];
