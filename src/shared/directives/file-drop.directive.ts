import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
  standalone: true,
})
export class FileDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();
  @Output() fileHovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    this.stopEvent(event);

    this.fileDropped.emit(event.dataTransfer?.files);
    this.fileHovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.stopEvent(event);
    this.fileHovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.stopEvent(event);
    this.fileHovered.emit(false);
  }

  private stopEvent(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
