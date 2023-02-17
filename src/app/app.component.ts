import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';

import { UploadService } from '@app/services/upload.service';
import { PreviewComponent } from '@app/components/preview/preview.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { DropAreaDirective } from '@app/directives/drop-area.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DropAreaDirective,
      outputs: ['hovering', 'filesDropped'],
    },
  ],
  standalone: true,
  imports: [PreviewComponent, HeaderComponent],
})
export class AppComponent {
  private readonly uploadService = inject(UploadService);

  isHovering = false;

  @HostListener('filesDropped', ['$event'])
  async onFilesDropped(files: File[]) {
    this.uploadService.addFiles(files);
  }

  @HostListener('hovering', ['$event'])
  async onHovering(value: boolean) {
    this.isHovering = value;
  }
}
