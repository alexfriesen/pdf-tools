import {
  Component,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FileDropDirective } from '../../directives/file-drop.directive';
import { validateFileType } from '../../helpers/file.helper';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FileDropDirective, MatIconModule],
  hostDirectives: [FileDropDirective],
})
export class UploadComponent {
  @Input()
  acceptTypes: string[] = [];

  @Output()
  fileSelected = new EventEmitter<File>();

  isHovering = false;

  private files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.addFiles(files);
    }
  }

  addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (!file) continue;

      if (validateFileType(file, this.acceptTypes)) {
        this.files.push(file);
        this.fileSelected.emit(file);
      }
    }
  }
}
