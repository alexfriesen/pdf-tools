import { Injectable, computed, signal } from '@angular/core';
import type { PDFDocument } from 'pdf-lib';

@Injectable({ providedIn: 'root' })
export class StoreService {
  readonly documentBuffer = signal<Uint8Array | null>(null);
  readonly documentProcessing = signal(false);
  readonly pageRenderingProcessing = signal(false);

  readonly hasDocument = computed(() => {
    const document = this.documentBuffer();
    return !!document;
  });

  async updateDocumentBuffer(document: PDFDocument | undefined) {
    this.documentProcessing.set(true);

    const buffer = (await document?.save()) || null;
    this.documentBuffer.set(buffer);

    this.documentProcessing.set(false);
  }
}
