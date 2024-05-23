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
import { TranslocoPipe } from '@jsverse/transloco';

import { StoreService } from '@app/services/store.service';
import { UploadService } from '@app/services/upload.service';
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
    TranslocoPipe,
  ],
})
export class HeaderComponent {
  private readonly storeService = inject(StoreService);
  private readonly uploadService = inject(UploadService);
  private readonly documentService = inject(DocumentService);
  private readonly lazyDialogService = inject(LazyDialogService);

  readonly isProcessing = computed(() => {
    const isProcessing =
      this.storeService.documentProcessing() ||
      this.storeService.pageRenderingProcessing();

    return isProcessing;
  });
  readonly hasDocument = this.storeService.hasDocument;

  async onDownloadFile() {
    await this.documentService.save('new');
  }

  onOpenFilePrompt() {
    this.uploadService.openFilePrompt();
  }

  async onOpenAbout() {
    await this.lazyDialogService.openAboutDialog();
  }

  async onOpenProperties() {
    const data = await this.lazyDialogService.openPropertiesDialogAsync(
      this.documentService.getMetadata()
    );

    if (data) {
      this.documentService.setMetadata(data);
    }
  }
}
