import { bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(), // Required for Angular Material animations
    provideHttpClient(), // If you're making HTTP calls
  ],
});
