import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import { BehaviorSubject, debounceTime, switchMap, tap } from 'rxjs';

import { DocumentService } from '@shared/services/document.service';

interface PagePreview {
  pageNumber: number;
  base64: string;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, DragDropModule, MatProgressBarModule],
})
export class PreviewComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  documentService = inject(DocumentService);

  processing = new BehaviorSubject(false);

  pages = this.documentService.preview.pipe(
    debounceTime(200),
    tap(() => this.processing.next(true)),
    switchMap(async (buffer) => {
      const canvas = this.canvas.nativeElement;
      const canvasContext = canvas.getContext('2d');

      const loadingTask = getDocument(buffer);
      const doc = await loadingTask.promise;

      const previewPages: PagePreview[] = [];

      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
        const page = await doc.getPage(pageNumber);

        const viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext: any = { canvasContext, viewport };

        const task = page.render(renderContext);
        await task.promise;

        previewPages.push({
          pageNumber,
          base64: canvas.toDataURL('image/png'),
        });
      }

      return previewPages;
    }),
    tap(() => this.processing.next(false))
  );

  constructor() {
    const pdfWorkerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/legacy/build/pdf.worker.min.js`;
    GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }

  async onChangePosition(event: CdkDragDrop<string[]>) {
    await this.documentService.swapPages(
      event.currentIndex,
      event.previousIndex
    );
  }
}
