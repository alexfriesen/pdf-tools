import {
  inject,
  Injectable,
  isDevMode,
  makeEnvironmentProviders,
  Provider,
  Type,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  defaultProviders,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoConfig,
  TranslocoLoader,
  Translation,
  getBrowserLang,
} from '@ngneat/transloco';

type TranslocoOptions = {
  config?: TranslocoConfig;
  loader?: Type<TranslocoLoader>;
};

export function provideTransloco(options: TranslocoOptions) {
  const providers: Provider[] = [...defaultProviders];

  if (options.config) {
    providers.push({
      provide: TRANSLOCO_CONFIG,
      useValue: options.config,
    });
  }

  if (options.loader) {
    providers.push({ provide: TRANSLOCO_LOADER, useClass: options.loader });
  }

  return makeEnvironmentProviders(providers);
}

export function generateAutoConfig(availableLangs: string[]) {
  const browserLang = getBrowserLang();
  const defaultLang =
    browserLang && availableLangs.includes(browserLang)
      ? browserLang
      : availableLangs.at(0);

  return translocoConfig({
    defaultLang,
    availableLangs,
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  });
}

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
