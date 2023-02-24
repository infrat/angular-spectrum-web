import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[positiveIntegers]'
})
export class PositiveIntegersDirective {

  constructor() { }

  @HostListener('keypress', [ '$event' ])
  public onInput(event: KeyboardEvent): void {
    const keyCode = event.key.charCodeAt(0);
    if (keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
      event.preventDefault()
    }
  }

}