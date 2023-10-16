import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PDFDocument } from 'pdf-lib';
import { Subject, map } from 'rxjs';

import { Metadata } from '../types/metadata';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  document: PDFDocument | undefined;

  readonly documentBuffer$ = new Subject<Uint8Array | null>();
  readonly documentBuffer = toSignal(this.documentBuffer$);

  readonly pageCount$ = this.documentBuffer$.pipe(
    map(() => this.document?.getPageCount() || 0)
  );

  async loadPDF(pdfBuffer: ArrayBuffer) {
    this.document = await PDFDocument.load(pdfBuffer);
    await this.updateDocumentBuffer();
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

    await this.updateDocumentBuffer();
  }

  async removePage(pageIndex: number) {
    if ((this.document?.getPageCount() || 0) > 1) {
      await this.document?.removePage(pageIndex);
    } else {
      delete this.document;
    }
    await this.updateDocumentBuffer();
  }

  async movePage(oldIndex: number, newIndex: number) {
    if (!this.document) return;

    const [page] = await this.document.copyPages(this.document, [oldIndex]);

    if (newIndex > oldIndex) {
      await this.document.removePage(oldIndex);
    }

    await this.document.insertPage(newIndex, page);

    if (newIndex < oldIndex) {
      // the copied page was added, so we need increase the index
      await this.document.removePage(oldIndex + 1);
    }

    await this.updateDocumentBuffer();
  }

  getMetadata() {
    return {
      title: this.document?.getTitle(),
      author: this.document?.getAuthor(),
      creator: this.document?.getCreator(),
      subject: this.document?.getSubject(),
      keywords: this.document?.getKeywords(),
      producer: this.document?.getProducer(),
      creationDate: this.document?.getCreationDate(),
      modificationDate: this.document?.getModificationDate(),
    };
  }

  setMetadata(metadata: Metadata) {
    this.document?.setTitle(metadata.title);
    this.document?.setAuthor(metadata.author);
    this.document?.setSubject(metadata.subject);
    this.document?.setKeywords((metadata.keywords || '').split(' '));
  }

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

    await this.updateDocumentBuffer();
  }

  async save(fileName: string) {
    if (!this.document) return;

    const dataUri = await this.document.saveAsBase64({ dataUri: true });
    this.downloadAs(dataUri, `${fileName}.pdf`);
  }

  async updateDocumentBuffer() {
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
