import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DocumentService } from '@app/services/document.service';
import { ThumbnailComponent } from '../thumb/thumb.component';
import { AttachmentsComponent } from '../attachments/attachments.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    ThumbnailComponent,
    AttachmentsComponent,
  ]
})
export class PagesComponent {
  private readonly documentService = inject(DocumentService);

  readonly attachments = this.documentService.attachments;
  readonly hasAttachments = computed(() => this.attachments().length > 0);

  readonly pageCount = this.documentService.pageCount;
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
