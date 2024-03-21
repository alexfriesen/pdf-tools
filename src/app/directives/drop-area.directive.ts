import { Directive, HostListener, output } from '@angular/core';
import { parseFilesFromEvent } from 'data-transfer-helper';

@Directive({
  selector: '[drop-area]',
  standalone: true,
})
export class DropAreaDirective {
  readonly hovering = output<boolean>();
  readonly filesDropped = output<File[]>();

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent) {
    this.stopEvent(event);
    this.hovering.emit(false);

    const files = await parseFilesFromEvent(event);
    this.filesDropped.emit(files);
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
