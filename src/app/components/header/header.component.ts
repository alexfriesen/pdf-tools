import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';

import { UploadService } from '@app/services/upload.service';
import { PreviewService } from '@app/services/preview.service';
import { DocumentService } from '@app/services/document.service';
import { AboutComponent } from '@app/components/about/about.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
    TranslocoModule,
  ],
})
export class HeaderComponent {
  private readonly dialog = inject(MatDialog);
  private readonly uploadService = inject(UploadService);
  private readonly previewService = inject(PreviewService);
  private readonly documentService = inject(DocumentService);

  readonly isProcessing = toSignal(this.previewService.isPocessing$);
  readonly canDownload = toSignal(
    this.documentService.documentBuffer$.pipe(map((document) => !!document))
  );

  async onDownloadFile() {
    await this.documentService.save('new');
  }

  onOpenFilePrompt() {
    this.uploadService.openFilePrompt();
  }

  onOpenAbout() {
    this.dialog.open(AboutComponent);
  }
}
