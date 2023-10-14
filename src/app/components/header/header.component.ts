import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';

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
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslocoModule,
  ],
})
export class HeaderComponent {
  private readonly dialog = inject(MatDialog);
  private readonly uploadService = inject(UploadService);
  private readonly previewService = inject(PreviewService);
  private readonly documentService = inject(DocumentService);

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

  onOpenAbout() {
    this.dialog.open(AboutComponent);
  }
}
