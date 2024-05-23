import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  translocoConfig,
  TranslocoLoader,
  Translation,
  getBrowserLang,
} from '@jsverse/transloco';

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
