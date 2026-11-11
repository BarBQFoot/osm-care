import { Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  detail?: string;
  confirmLabel: string;
  cancelLabel: string;
}

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  host: { class: 'dialog-host', '(document:keydown.escape)': 'onEscape()' },
})
export class ConfirmDialog {
  readonly data = input.required<ConfirmDialogData>();
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly cancelButton = viewChild.required<ElementRef<HTMLButtonElement>>('cancelButton');

  constructor() {
    afterNextRender(() => this.cancelButton().nativeElement.focus());
  }

  onEscape(): void {
    this.cancelled.emit();
  }
}
