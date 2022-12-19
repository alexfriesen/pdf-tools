import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { validateFileType } from '../helpers/file.helper';
import { DocumentService } from './document.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly document = inject(DOCUMENT);
  private readonly documentService = inject(DocumentService);

  readonly acceptTypes: string[] = ['application/pdf'];

  input = this.createUploadElement();

  openFilePrompt() {
    this.input.click();
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      await this.addFiles(files);
    }

    // reset current value
    target.value = '';
  }

  async addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (!file) continue;

      if (validateFileType(file, this.acceptTypes)) {
        await this.addFile(file);
      }
    }
  }

  async addFile(file: File) {
    const buffer = await file.arrayBuffer();
    await this.documentService.appendPDF(buffer);
  }

  private createUploadElement() {
    const element = this.document.createElement('input');
    element.hidden = true;
    element.type = 'file';
    element.multiple = true;
    element.accept = this.acceptTypes.join('|');
    element.onchange = (event) => this.onFileChange(event);

    this.document.body.appendChild(element);

    return element;
  }
}
