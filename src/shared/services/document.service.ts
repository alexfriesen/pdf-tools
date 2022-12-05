import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  document: PDFDocument | undefined;

  preview = new Subject<Uint8Array | undefined>();

  async load(pdfBuffer: Buffer | ArrayBuffer) {
    this.document = await PDFDocument.load(pdfBuffer);
    await this.updatePreview();
  }

  async applyPDF(pdfBuffer: Buffer | ArrayBuffer) {
    if (!this.document) {
      return this.load(pdfBuffer);
    }

    const doc = await PDFDocument.load(pdfBuffer);

    const pages = await this.document.copyPages(doc, doc.getPageIndices());
    for (const page of pages) {
      this.document.addPage(page);
    }

    await this.updatePreview();
  }

  async removePage(pageIndex: number) {
    if ((this.document?.getPageCount() || 0) > 1) {
      await this.document?.removePage(pageIndex);
    } else {
      delete this.document;
    }
    await this.updatePreview();
  }

  // TODO: very unpredictable
  async swapPages(pageIndex1: number, pageIndex2: number) {
    if (!this.document) return;

    const [page1, page2] = await this.document.copyPages(this.document, [
      pageIndex1,
      pageIndex2,
    ]);

    await this.document.removePage(pageIndex2);
    await this.document.insertPage(pageIndex2, page1);
    await this.document.removePage(pageIndex1);
    await this.document.insertPage(pageIndex1, page2);

    await this.updatePreview();
  }

  async save(fileName: string) {
    if (!this.document) return;

    const dataUri = await this.document.saveAsBase64({ dataUri: true });

    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  async updatePreview() {
    const buffer = (await this.document?.save()) || undefined;
    this.preview.next(buffer);
  }
}
