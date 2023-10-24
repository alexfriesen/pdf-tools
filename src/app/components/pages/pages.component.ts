import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MixedCdkDragDropModule } from 'angular-mixed-cdk-drag-drop';
import { TranslocoPipe } from '@ngneat/transloco';

import { DocumentService } from '@app/services/document.service';
import { PreviewService } from '@app/services/preview.service';
import { EmptyComponent } from '../empty/empty.component';
import { ThumbnailComponent } from '../thumb/thumb.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    MixedCdkDragDropModule,
    TranslocoPipe,

    ThumbnailComponent,
    EmptyComponent,
  ],
})
export class PagesComponent {
  private readonly documentService = inject(DocumentService);
  private readonly previewService = inject(PreviewService);

  readonly previewRenders = this.previewService.pagesPreviews;
  readonly pageCount = this.documentService.pageCount;
  readonly pages = computed(() => {
    const pageCount = this.pageCount();
    console.log(pageCount);
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
