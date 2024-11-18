import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  input,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PreviewService } from '@app/services/preview.service';

@Component({
  selector: 'app-thumb',
  templateUrl: './thumb.component.html',
  styleUrls: ['./thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule]
})
export class ThumbnailComponent {
  private readonly pagesPreviews = inject(PreviewService).pagesPreviews;

  pageIndex = input.required<number>();

  readonly imageSrc = computed(() => {
    const index = this.pageIndex();
    const found = this.pagesPreviews()?.find(
      (preview) => preview.pageIndex === index
    );

    return found?.base64 || undefined;
  });
}
