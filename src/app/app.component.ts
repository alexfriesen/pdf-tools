import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { validateFileType } from '@shared/helpers/file.helper';
import { DocumentService } from '@shared/services/document.service';
import { PreviewComponent } from '@shared/components/preview/preview.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PreviewComponent],
})
export class AppComponent {
  private readonly documentService = inject(DocumentService);

  readonly acceptTypes: string[] = ['application/pdf'];

  isHovering = false;

  readonly canDownload$ = this.documentService.documentBuffer$.pipe(
    map((preview) => !!preview)
  );

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent) {
    this.stopEvent(event);

    const files = event.dataTransfer?.files;
    if (files) {
      await this.addFiles(files);
    }
    this.isHovering = false;
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

  async onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      await this.addFiles(files);
    }
  }

  async addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (!file) continue;

      if (validateFileType(file, this.acceptTypes)) {
        await this.fileAdded(file);
      }
    }
  }

  async fileAdded(data: File) {
    const buffer = await data.arrayBuffer();
    await this.documentService.appendPDF(buffer);
  }

  async downloadFile() {
    await this.documentService.save('new');
  }
}
