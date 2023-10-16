import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';

import { UploadService } from '@app/services/upload.service';
import { PreviewService } from '@app/services/preview.service';
import { DocumentService } from '@app/services/document.service';
import { LazyDialogService } from '@app/services/lazy-dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslocoModule,
  ],
})
export class HeaderComponent {
  private readonly uploadService = inject(UploadService);
  private readonly previewService = inject(PreviewService);
  private readonly documentService = inject(DocumentService);
  private readonly lazyDialogService = inject(LazyDialogService);

  readonly isProcessing = this.previewService.isProcessing;
  readonly hasDocument = computed(() => {
    const document = this.documentService.documentBuffer();
    return !!document;
  });

  async onDownloadFile() {
    await this.documentService.save('new');
  }

  onOpenFilePrompt() {
    this.uploadService.openFilePrompt();
  }

  async onOpenAbout() {
    await this.lazyDialogService.openAboutDialog();
  }
}
