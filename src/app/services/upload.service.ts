import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { validateFileSize, validateFileType } from '../helpers/file.helper';
import { DocumentService } from './document.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly document = inject(DOCUMENT);
  private readonly documentService = inject(DocumentService);

  readonly acceptTypes: string[] = ['application/pdf', '.pdf'];

  readonly input = this.createUploadElement();

  openFilePrompt() {
    this.input.click();
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      await this.addFileList(files);
    }

    // reset current value
    target.value = '';
  }

  async addFileList(list: FileList) {
    const files: File[] = Array.from(list);

    await this.addFiles(files);
  }

  async addFiles(files: File[]) {
    for (const file of files) {
      if (this.validateFile(file)) {
        const buffer = await file.arrayBuffer();
        await this.documentService.appendPDF(buffer);
      }
    }
  }

  private validateFile(file: File) {
    return validateFileType(file, this.acceptTypes) && validateFileSize(file);
  }

  private createUploadElement() {
    const element = this.document.createElement('input');
    element.hidden = true;
    element.type = 'file';
    element.multiple = true;
    // element.webkitdirectory = true;
    element.accept = this.acceptTypes.join(',');
    element.onchange = (event) => this.onFileChange(event);

    this.document.body.appendChild(element);

    return element;
  }
}
