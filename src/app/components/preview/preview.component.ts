import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MixedCdkDragDropModule } from 'angular-mixed-cdk-drag-drop';
import { TranslocoModule } from '@ngneat/transloco';
import { getDocument } from 'pdfjs-dist';
import { switchMap } from 'rxjs';

import { DocumentService } from '@app/services/document.service';
import { PreviewService } from '@app/services/preview.service';
import { PreviewPipe } from '@app/pipes/preview.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
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

  readonly previewRenders = toSignal(this.previewService.pagesPreviews$);
  readonly pages = toSignal(
    this.documentService.documentBuffer$.pipe(
      switchMap(async (buffer) => {
        if (!buffer) return undefined;

        const task = getDocument(buffer);
        const doc = await task.promise;

        return Array.from(Array(doc.numPages).keys());
      })
    )
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
