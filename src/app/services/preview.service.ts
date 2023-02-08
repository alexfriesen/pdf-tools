import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, switchMap, tap } from 'rxjs';
import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  version,
} from 'pdfjs-dist';

import { DocumentService } from './document.service';

export interface PagePreview {
  pageIndex: number;
  base64: string;
}

@Injectable({ providedIn: 'root' })
export class PreviewService {
  private readonly documentService = inject(DocumentService);
  readonly isPocessing$ = new BehaviorSubject(false);

  readonly pagesPreviews$ = new BehaviorSubject<PagePreview[] | null>(null);

  constructor() {
    const pdfWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;
    GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    this.documentService.documentBuffer$
      .pipe(
        debounceTime(100),
        tap(() => this.isPocessing$.next(true)),
        switchMap(async (buffer) => {
          if (!buffer) return null;

          const task = getDocument({ data: buffer });
          const doc = await task.promise;

          return Promise.all(
            Array.from(Array(doc.numPages).keys()).map((pageNumber) =>
              this.renderPagePreview(doc, pageNumber)
            )
          );
        }),
        tap((data) => this.pagesPreviews$.next(data)),
        tap(() => this.isPocessing$.next(false))
      )
      .subscribe();
  }

  private async renderPagePreview(
    doc: PDFDocumentProxy,
    pageIndex: number
  ): Promise<PagePreview> {
    const page = await doc.getPage(pageIndex + 1);

    const viewport = page.getViewport({ scale: 0.5 });

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d', {
      willReadFrequently: true,
    })!;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const task = page.render({ canvasContext, viewport });
    await task.promise;

    return {
      pageIndex,
      base64: canvas.toDataURL(),
    };
  }
}
