import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MixedCdkDragDropModule } from 'angular-mixed-cdk-drag-drop';
import { switchMap } from 'rxjs';
import { getDocument } from 'pdfjs-dist';

import { DocumentService } from '@app/services/document.service';
import { PreviewService } from '@app/services/preview.service';
import { PreviewPipe } from '@app/pipes/preview.pipe';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MixedCdkDragDropModule,
    TranslocoModule,
    PreviewPipe,
  ],
})
export class PreviewComponent {
  private readonly documentService = inject(DocumentService);
  private readonly previewService = inject(PreviewService);

  readonly prewiewRenders$ = this.previewService.pagesPreviews$;
  readonly pages$ = this.documentService.documentBuffer$.pipe(
    switchMap(async (buffer) => {
      if (!buffer) return undefined;

      const task = getDocument(buffer);
      const doc = await task.promise;

      return Array.from(Array(doc.numPages).keys());
    })
  );

  async onChangePosition(event: {
    previousIndex: number;
    currentIndex: number;
  }) {
    await this.documentService.movePage(
      event.previousIndex,
      event.currentIndex
    );
  }

  async onRemovePage(pageIndex: number) {
    await this.documentService.removePage(pageIndex);
  }
}
