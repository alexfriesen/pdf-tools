import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  document: PDFDocument | undefined;

  preview = new Subject<any>();

  async init(pdfBuffer: Buffer | ArrayBuffer) {
    this.document = await PDFDocument.load(pdfBuffer);
    await this.updatePreview();
  }

  async applyPDF(pdfBuffer: Buffer | ArrayBuffer) {
    if (!this.document) {
      return this.init(pdfBuffer);
    }

    const doc = await PDFDocument.load(pdfBuffer);

    const pages = await this.document.copyPages(doc, doc.getPageIndices());
    for (const page of pages) {
      this.document.addPage(page);
    }

    await this.updatePreview();
  }

  // TODO: very unpredictable
  async swapPages(pageNumber1: number, pageNumber2: number) {
    if (!this.document) return;

    const [page1, page2] = await this.document.copyPages(this.document, [
      pageNumber1,
      pageNumber2,
    ]);

    await this.document.removePage(pageNumber2);
    await this.document.insertPage(pageNumber2, page1);
    await this.document.removePage(pageNumber1);
    await this.document.insertPage(pageNumber1, page2);

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
    if (!this.document) return;

    this.preview.next(await this.document.save());
  }
}
