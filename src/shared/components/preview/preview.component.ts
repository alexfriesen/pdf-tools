import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { BehaviorSubject, debounceTime, switchMap, tap } from 'rxjs';
import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  version,
} from 'pdfjs-dist';

import { DocumentService } from '@shared/services/document.service';

interface PagePreview {
  pageIndex: number;
  base64: string;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    DragDropModule,
  ],
})
export class PreviewComponent {
  private readonly documentService = inject(DocumentService);

  readonly ispPocessing$ = new BehaviorSubject(false);

  pages$ = this.documentService.documentBuffer$.pipe(
    debounceTime(100),
    tap(() => this.ispPocessing$.next(true)),
    switchMap(async (buffer) => {
      if (!buffer) return undefined;

      const task = getDocument(buffer);
      const doc = await task.promise;

      return Promise.all(
        Array.from(Array(doc.numPages).keys()).map((pageNumber) =>
          this.renderPagePreview(doc, pageNumber)
        )
      );
    }),
    tap(() => this.ispPocessing$.next(false))
  );

  constructor() {
    const pdfWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;
    GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }

  async onChangePosition(event: CdkDragDrop<string[]>) {
    await this.documentService.swapPages(
      event.currentIndex,
      event.previousIndex
    );
  }

  async onRemovePage(pageIndex: number) {
    await this.documentService.removePage(pageIndex);
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
    });

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext: any = { canvasContext, viewport };

    const task = page.render(renderContext);
    await task.promise;

    return {
      pageIndex,
      base64: canvas.toDataURL(),
    };
  }
}
