import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// [E01] Arranca la app: componente raíz + configuración. Ya no hay AppModule
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
