import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class LazyDialogService {
  private readonly dialog = inject(MatDialog);

  async openAboutDialog() {
    const component = await import(
      '../components/about-dialog/about-dialog.component'
    );

    return this.dialog.open(component.AboutDialogComponent);
  }
}
