import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';

import { UploadService } from '@app/services/upload.service';
import { PreviewComponent } from '@app/preview/preview.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    PreviewComponent,
    HeaderComponent,
  ],
})
export class AppComponent {
  private readonly uploadService = inject(UploadService);
  isHovering = false;

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
