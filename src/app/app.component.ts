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
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
    imports: [PreviewComponent, HeaderComponent]
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

  constructor() {
    // const host = isPlatformServer(inject(PLATFORM_ID)) ? environment.webHost : '.';
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon(
      'zip',
      sanitizer.bypassSecurityTrustResourceUrl(`./assets/filetype/zip.svg`)
    );
    iconRegistry.addSvgIcon(
      'xml',
      sanitizer.bypassSecurityTrustResourceUrl(`./assets/filetype/xml.svg`)
    );
    iconRegistry.addSvgIcon(
      'image',
      sanitizer.bypassSecurityTrustResourceUrl(`./assets/filetype/image.svg`)
    );
    iconRegistry.addSvgIcon(
      'unknown',
      sanitizer.bypassSecurityTrustResourceUrl(`./assets/filetype/unknown.svg`)
    );
  }
}
