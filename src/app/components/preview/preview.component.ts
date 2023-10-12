import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MixedCdkDragDropModule } from 'angular-mixed-cdk-drag-drop';
import { TranslocoModule } from '@ngneat/transloco';

import { DocumentService } from '@app/services/document.service';
import { PreviewService } from '@app/services/preview.service';
import { ThumbnailComponent } from '../thumb/thumb.component';

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

    ThumbnailComponent,
  ],
})
export class PreviewComponent {
  private readonly documentService = inject(DocumentService);
  private readonly previewService = inject(PreviewService);

  readonly previewRenders = this.previewService.pagesPreviews;
  readonly pageCount = toSignal(this.documentService.pageCount$);
  readonly pages = computed(() => {
    const pageCount = this.pageCount();
    if (!pageCount) return undefined;

    return Array.from(Array(pageCount).keys());
  });

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
