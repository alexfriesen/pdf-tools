import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadComponent } from '@shared/components/upload/upload.component';
import { FileDropDirective } from '@shared/directives/file-drop.directive';
import { AppService } from './app.service';
import { PreviewComponent } from '@shared/components/preview/preview.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, FileDropDirective, UploadComponent, PreviewComponent],
  hostDirectives: [FileDropDirective],
})
export class AppComponent {
  service = inject(AppService);

  readonly preview = this.service.preview;

  async fileAdded(data: File) {
    const buffer = await data.arrayBuffer();
    await this.service.applyPDF(buffer);
  }
}
