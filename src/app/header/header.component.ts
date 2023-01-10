import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';

import { UploadService } from '@app/services/upload.service';
import { PreviewService } from '@app/services/preview.service';
import { DocumentService } from '@app/services/document.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    TranslocoModule,
  ],
})
export class HeaderComponent {
  private readonly uploadService = inject(UploadService);
  private readonly previewService = inject(PreviewService);
  private readonly documentService = inject(DocumentService);

  readonly isProcessing$ = this.previewService.isPocessing$;

  readonly canDownload$ = this.documentService.documentBuffer$.pipe(
    map((preview) => !!preview)
  );

  async onDownloadFile() {
    await this.documentService.save('new');
  }

  onOpenFilePromt() {
    this.uploadService.openFilePrompt();
  }
}
