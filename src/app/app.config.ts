import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MixedCdkDragDropModule } from 'angular-mixed-cdk-drag-drop';
import { provideTransloco } from '@ngneat/transloco';

import {
  TranslocoHttpLoader,
  generateAutoConfig,
} from './helpers/transloco.helper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideClientHydration(),
    importProvidersFrom(MixedCdkDragDropModule),
    provideTransloco({
      config: generateAutoConfig(['en', 'de']),
      loader: TranslocoHttpLoader,
    }),
  ],
};
