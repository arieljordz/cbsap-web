import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app/app.routes';
import { GlobalErrorInterceptor } from './app/core/core.index';
import { MyPreset } from './cbspreset';
import { DatePipe } from '@angular/common';


export const appConfig: ApplicationConfig = {
  providers: [
   
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withInterceptors([GlobalErrorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,

        options: {
          darkModeSelector: false,
        },
      },
      ripple: true,
    }),
    DatePipe,
    MessageService,
    ConfirmationService,
  ],
};
