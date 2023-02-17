import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
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
    NgIf,
    AsyncPipe,
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

  readonly isProcessing$ = this.previewService.isPocessing$;
  readonly canDownload$ = this.documentService.documentBuffer$.pipe(
    map((document) => !!document)
  );

  async onDownloadFile() {
    await this.documentService.save('new');
  }

  onOpenFilePromt() {
    this.uploadService.openFilePrompt();
  }

  onOpenAbout() {
    this.dialog.open(AboutComponent);
  }
}
