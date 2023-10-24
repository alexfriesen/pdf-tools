import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { DocumentService } from '@app/services/document.service';
import { EmptyComponent } from '../empty/empty.component';
import { PagesComponent } from '../pages/pages.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EmptyComponent, PagesComponent],
})
export class PreviewComponent {
  readonly hasDocument = inject(DocumentService).hasDocument;
}
