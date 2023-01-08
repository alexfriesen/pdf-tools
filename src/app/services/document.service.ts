import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  document: PDFDocument | undefined;

  readonly documentBuffer$ = new Subject<Uint8Array | null>();

  async loadPDF(pdfBuffer: ArrayBuffer) {
    this.document = await PDFDocument.load(pdfBuffer);
    await this.updatePreview();
  }

  async appendPDF(pdfBuffer: ArrayBuffer) {
    if (!this.document) {
      return this.loadPDF(pdfBuffer);
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
    this.downloadAs(dataUri, `${fileName}.pdf`);
  }

  async updatePreview() {
    const buffer = (await this.document?.save()) || null;
    this.documentBuffer$.next(buffer);
  }

  private downloadAs(dataUri: string, name: string) {
    // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue https://github.com/eligrey/FileSaver.js/issues/561)
    const a = document.createElementNS(
      'http://www.w3.org/1999/xhtml',
      'a'
    ) as HTMLAnchorElement;
    a.download = name;
    a.rel = 'noopener';
    a.href = dataUri;

    setTimeout(() => URL.revokeObjectURL(a.href), 40 /* sec */ * 1000);
    setTimeout(() => a.click(), 0);
  }
}
