import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { switchMap } from 'rxjs';
import { getDocument } from 'pdfjs-dist';

import { DocumentService } from '@app/services/document.service';
import { PreviewService } from '../services/preview.service';
import { PreviewPipe } from '../pipes/preview.pipe';

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
    MatProgressSpinnerModule,
    DragDropModule,
    TranslocoModule,
    PreviewPipe,
  ],
})
export class PreviewComponent {
  private readonly documentService = inject(DocumentService);
  private readonly previewService = inject(PreviewService);

  readonly isProcessing$ = this.previewService.isPocessing$;
  readonly prewiewRenders$ = this.previewService.pagesPreviews$;

  pages$ = this.documentService.documentBuffer$.pipe(
    switchMap(async (buffer) => {
      if (!buffer) return undefined;

      const task = getDocument(buffer);
      const doc = await task.promise;

      return Array.from(Array(doc.numPages).keys());
    })
  );

  async onChangePosition(event: CdkDragDrop<string[]>) {
    await this.documentService.swapPages(
      event.currentIndex,
      event.previousIndex
    );
  }

  async onRemovePage(pageIndex: number) {
    await this.documentService.removePage(pageIndex);
  }
}
