import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { StoreService } from '@app/services/store.service';
import { EmptyComponent } from '../empty/empty.component';
import { PagesComponent } from '../pages/pages.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyComponent, PagesComponent]
})
export class PreviewComponent {
  readonly hasDocument = inject(StoreService).hasDocument;
}
