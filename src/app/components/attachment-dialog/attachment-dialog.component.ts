import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

import { DocumentAttachment } from '@app/types/attachment';

@Component({
  selector: 'app-attachment-dialog',
  templateUrl: './attachment-dialog.component.html',
  styleUrls: ['./attachment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslocoPipe,
  ]
})
export class AttachmentDialogComponent {
  readonly file = inject<DocumentAttachment>(MAT_DIALOG_DATA);

  fileContent: string | undefined;
  dataUrl: string | undefined;

  constructor() {
    this.fileContent = new TextDecoder().decode(this.file.data);
    this.dataUrl = this.toBase64Data(this.file);
  }

  private toBase64Data(file: DocumentAttachment) {
    return `data:${file.mimeType};base64,${blobToBase64(this.file.data)}`;
  }
}

export const blobToBase64 = (blob: Uint8Array) => {
  const output = [];
  for (let i = 0, { length } = blob; i < length; i++)
    output.push(String.fromCharCode(blob[i]));
  return btoa(output.join(''));
};
