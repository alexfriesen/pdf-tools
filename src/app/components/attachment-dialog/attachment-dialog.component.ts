import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslocoPipe,
  ],
})
export class AttachmentDialogComponent {
  readonly data = inject<DocumentAttachment>(MAT_DIALOG_DATA);

  fileContent: string | undefined;

  constructor() {
    this.fileContent = new TextDecoder().decode(this.data.data);
  }
}
