import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { DocumentMetadata } from '@app/types/metadata';

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

  async openPropertiesDialogAsync(data: DocumentMetadata) {
    const ref = await this.openPropertiesDialog(data);
    const result = await firstValueFrom<DocumentMetadata>(ref.afterClosed());

    return result;
  }
}
