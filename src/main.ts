import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

import { CoreModule } from './app/core.module';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CoreModule),
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));
