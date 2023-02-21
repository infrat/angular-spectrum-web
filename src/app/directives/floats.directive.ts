import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[floats]'
})
export class FloatsDirective {

  @Input()
  public min: number = 0;

  @Input()
  public max: number = 0;

  constructor() { }

  @HostListener('keypress', [ '$event' ])
  public onInput(event: KeyboardEvent): void {
    const keyCode = event.key.charCodeAt(0);
    if (
      keyCode !== 44 &&
      keyCode !== 45 &&
      keyCode !== 46 &&
      keyCode > 31 &&
      (keyCode < 48 || keyCode > 57)
    ) {
      event.preventDefault();
    }
  }

}