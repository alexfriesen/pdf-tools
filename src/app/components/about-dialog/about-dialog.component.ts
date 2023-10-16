import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  // styleUrls: ['./about-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, TranslocoModule],
})
export class AboutDialogComponent {}
