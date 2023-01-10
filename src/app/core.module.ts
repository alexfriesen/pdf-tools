import {
  APP_INITIALIZER,
  inject,
  Injectable,
  isDevMode,
  NgModule,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
  TranslocoService,
  getBrowserLang,
} from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export function initDefaultLang(transloco: TranslocoService) {
  return function () {
    const browserLang = getBrowserLang();

    const isAvailable = transloco
      .getAvailableLangs()
      .some((lang) => lang === browserLang);

    if (browserLang && isAvailable) {
      transloco.setActiveLang(browserLang);
    }
  };
}

export const defaultLangInitializer = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: initDefaultLang,
  deps: [TranslocoService],
};

@NgModule({
  imports: [HttpClientModule],
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        fallbackLang: 'en',
        missingHandler: {
          // It will use the first language set in the `fallbackLang` property
          useFallbackTranslation: true,
        },
        prodMode: !isDevMode(),
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
    defaultLangInitializer,
  ],
})
export class CoreModule {}
