import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [providePrimeNG({
    theme: {
      preset: Lara,
      options: {
        darkModeSelector: false, // Disable dark mode
      }

    }
  }), importProvidersFrom(BrowserAnimationsModule), provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()), provideHttpClient(), provideZoneChangeDetection({ eventCoalescing: true })]
};
