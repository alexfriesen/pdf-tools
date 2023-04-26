import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';

import { TranslocoHttpLoader, generateAutoConfig, provideTransloco } from './app/helpers/provide-transloco';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
    provideTransloco({
      config: generateAutoConfig(['en', 'de']),
      loader: TranslocoHttpLoader,
    }),
  ],
}).catch((err) => console.error(err));
