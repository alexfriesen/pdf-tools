import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs';

import { UploadService } from '@shared/services/upload.service';
import { DocumentService } from '@shared/services/document.service';
import { PreviewComponent } from '@shared/components/preview/preview.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PreviewComponent],
})
export class AppComponent {
  private readonly uploadService = inject(UploadService);
  private readonly documentService = inject(DocumentService);

  isHovering = false;

  readonly canDownload$ = this.documentService.documentBuffer$.pipe(
    map((preview) => !!preview)
  );

  async onDownloadFile() {
    await this.documentService.save('new');
  }

  onOpenFilePromt() {
    this.uploadService.openFilePrompt();
  }

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent) {
    this.stopEvent(event);
    this.isHovering = false;

    const items = event.dataTransfer?.items;
    if (items) {
      await this.uploadService.addDataTransferItemList(items);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.stopEvent(event);
    this.isHovering = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.stopEvent(event);
    this.isHovering = false;
  }

  private stopEvent(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
