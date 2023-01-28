import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { parseDataTransferItem } from '../helpers/filesystem.helper';

@Directive({
  selector: '[drop-area]',
  standalone: true,
})
export class DropAreaDirective {
  @Output()
  hovering = new EventEmitter<boolean>();

  @Output()
  filesDropped = new EventEmitter<File[]>();

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent) {
    this.stopEvent(event);
    this.hovering.emit(false);

    const list = event.dataTransfer?.items;
    if (list) {
      const items = Array.from(list).filter((item) => item.kind === 'file');
      const fileChunks = await Promise.all(
        items.map(async (item) => parseDataTransferItem(item))
      );
      const files = fileChunks.flat();
      this.filesDropped.emit(files);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.stopEvent(event);
    this.hovering.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.stopEvent(event);
    this.hovering.emit(false);
  }

  private stopEvent(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
