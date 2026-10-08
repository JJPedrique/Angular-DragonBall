import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // [E02] providers globales: lo que antes iba en el AppModule
    provideBrowserGlobalErrorListeners(),
    // [E03] Router. withComponentInputBinding: los parámetros de la URL llegan como input()
    provideRouter(routes, withComponentInputBinding()),
    // [E04] Habilita HttpClient en toda la app (antes: importar HttpClientModule)
    provideHttpClient(withFetch()),
  ],
};
