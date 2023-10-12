import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Input,
  computed,
  signal,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PreviewService } from '@app/services/preview.service';

@Component({
  selector: 'app-thumb',
  templateUrl: './thumb.component.html',
  styleUrls: ['./thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class ThumbnailComponent {
  private readonly pagesPreviews = inject(PreviewService).pagesPreviews;

  @Input()
  set pageIndex(value: number) {
    this.currentPageIndex.set(value);
  }

  readonly currentPageIndex = signal<number | undefined>(undefined);

  readonly imageSrc = computed(() => {
    const index = this.currentPageIndex();
    const found = this.pagesPreviews()?.find(
      (preview) => preview.pageIndex === index
    );

    return found?.base64 || undefined;
  });
}
