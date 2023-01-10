import { Pipe, PipeTransform } from '@angular/core';
import { PagePreview } from '../services/preview.service';

@Pipe({
  name: 'preview',
  standalone: true,
})
export class PreviewPipe implements PipeTransform {
  transform(
    pagesPreviews: PagePreview[],
    pageIndex: number
  ): string | undefined {
    return pagesPreviews.find((preview) => preview.pageIndex === pageIndex)
      ?.base64;
  }
}
