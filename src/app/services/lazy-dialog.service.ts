import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { DocumentMetadata } from '@app/types/metadata';
import { DocumentAttachment } from '@app/types/attachment';

@Injectable({ providedIn: 'root' })
export class LazyDialogService {
  private readonly dialog = inject(MatDialog);

  async openAboutDialog() {
    const component = await import(
      '../components/about-dialog/about-dialog.component'
    );

    return this.dialog.open(component.AboutDialogComponent);
  }

  async openPropertiesDialog(data: DocumentMetadata) {
    const component = await import(
      '../components/properties-dialog/properties-dialog.component'
    );

    return this.dialog.open(component.PropertiesDialogComponent, { data });
  }

  async openAttachmentDialog(data: DocumentAttachment) {
    const component = await import(
      '../components/attachment-dialog/attachment-dialog.component'
    );
    return this.dialog.open(component.AttachmentDialogComponent, {
      data,
      maxWidth: '92vw',
      maxHeight: '92vh',
    });
  }

  async openPropertiesDialogAsync(data: DocumentMetadata) {
    const ref = await this.openPropertiesDialog(data);
    const result = await firstValueFrom<DocumentMetadata>(ref.afterClosed());

    return result;
  }
}
