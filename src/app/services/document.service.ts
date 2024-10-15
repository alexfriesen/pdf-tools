import { Injectable, computed, inject } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

import { DocumentMetadata } from '@app/types/metadata';
import { extractAttachments } from '@app/helpers/pdf.helper';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private document: PDFDocument | undefined;

  private readonly storeService = inject(StoreService);

  readonly pageCount = computed(() => {
    if (!this.storeService.documentBuffer()) return 0;

    return this.document?.getPageCount() || 0;
  });

  readonly attachments = computed(() => {
    if (!this.storeService.documentBuffer()) return [];

    return this.getAttachments();
  });

  async loadPDF(pdfBuffer: ArrayBuffer) {
    this.document = await PDFDocument.load(pdfBuffer);
    await this.storeService.updateDocumentBuffer(this.document);
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

    await this.storeService.updateDocumentBuffer(this.document);
  }

  async removePage(pageIndex: number) {
    if ((this.document?.getPageCount() || 0) > 1) {
      await this.document?.removePage(pageIndex);
    } else {
      this.document = undefined;
    }
    await this.storeService.updateDocumentBuffer(this.document);
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

    await this.storeService.updateDocumentBuffer(this.document);
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

    await this.storeService.updateDocumentBuffer(this.document);
  }

  getMetadata(): DocumentMetadata {
    return {
      title: this.document?.getTitle() || '',
      author: this.document?.getAuthor() || '',
      subject: this.document?.getSubject() || '',
      keywords: this.document?.getKeywords() || '',
      creator: this.document?.getCreator(),
      producer: this.document?.getProducer(),
      creationDate: this.document?.getCreationDate(),
      modificationDate: this.document?.getModificationDate(),
    };
  }

  setMetadata(metadata: DocumentMetadata) {
    this.document?.setTitle(metadata.title || '');
    this.document?.setAuthor(metadata.author || '');
    this.document?.setSubject(metadata.subject || '');
    this.document?.setKeywords((metadata.keywords || '').split(' '));
  }

  getAttachments() {
    if (this.document) {
      return extractAttachments(this.document);
    }
    return [];
  }

  async save(fileName: string) {
    if (!this.document) return;

    const dataUri = await this.document.saveAsBase64({ dataUri: true });
    this.downloadAs(dataUri, `${fileName}.pdf`);
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
