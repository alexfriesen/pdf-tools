import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

import { DocumentAttachment } from '@app/types/attachment';
import { LazyDialogService } from '@app/services/lazy-dialog.service';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    MatIconModule,
    MatButtonModule,
    TranslocoPipe,
  ],
})
export class AttachmentsComponent {
  private readonly lazyDialogService = inject(LazyDialogService);

  readonly attachments = input.required<DocumentAttachment[]>();

  inspectAttachment(attachment: DocumentAttachment) {
    this.lazyDialogService.openAttachmentDialog(attachment);
  }
}
