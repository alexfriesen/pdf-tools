import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  version,
} from 'pdfjs-dist';

import { StoreService } from './store.service';

export interface PagePreview {
  pageIndex: number;
  base64: string;
}

@Injectable({ providedIn: 'root' })
export class PreviewService {
  private readonly storeService = inject(StoreService);

  readonly pagesPreviews = signal<PagePreview[] | null>(null);

  constructor() {
    const pdfWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;
    GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    toObservable(this.storeService.documentBuffer)
      .pipe(
        tap(() => this.storeService.pageRenderingProcessing.set(true)),
        switchMap((buffer) => this.generatePagePreviews(buffer)),
        tap(() => this.storeService.pageRenderingProcessing.set(false))
      )
      .subscribe();
  }

  private async generatePagePreviews(buffer: Uint8Array | null) {
    if (!buffer) return false;

    const task = getDocument({ data: buffer });
    const doc = await task.promise;

    await Promise.all(
      Array.from(Array(doc.numPages).keys()).map((pageNumber) =>
        this.renderPagePreview(doc, pageNumber)
      )
    );

    return true;
  }

  private async renderPagePreview(doc: PDFDocumentProxy, pageIndex: number) {
    const page = await doc.getPage(pageIndex + 1);

    const viewport = page.getViewport({ scale: 0.5 });

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d', {
      willReadFrequently: true,
      alpha: false,
    })!;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const task = page.render({ canvasContext, viewport });
    await task.promise;

    const base64 = canvas.toDataURL();
    page.cleanup();

    const data = {
      pageIndex,
      base64,
    };

    this.addOrReplacePreview(data);
  }

  private async addOrReplacePreview(entry: PagePreview) {
    this.pagesPreviews.update((data) => {
      if (!data) return [entry];

      const filteredData = data?.filter((p) => p.pageIndex !== entry.pageIndex);
      return [...filteredData, entry];
    });
  }
}
