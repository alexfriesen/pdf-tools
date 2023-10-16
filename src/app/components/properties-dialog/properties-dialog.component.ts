import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { Metadata } from '@app/types/metadata';

@Component({
  selector: 'app-properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslocoModule,
  ],
})
export class PropertiesDialogComponent {
  readonly data = inject<Metadata>(MAT_DIALOG_DATA);

  readonly form = new FormGroup({
    title: new FormControl(this.data.title || ''),
    author: new FormControl(this.data.author || ''),
    subject: new FormControl(this.data.subject || ''),
    keywords: new FormControl(this.data.keywords || ''),
  });
}
