import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[minMax]'
})
export class MinMaxDirective {

  @Input()
  public min: number = 0;

  @Input()
  public max: number = 0;

  constructor(private ref: ElementRef) { }

  @HostListener('input', [ '$event' ])
  public onInput(): void {
    let val = parseInt(this.ref.nativeElement.value);
    if(this.max !== null && this.max !== undefined  && val >= this.max)
      this.ref.nativeElement.value = this.max.toString();
    else if (this.min !== null && this.min !== undefined  && val <= this.min)
      this.ref.nativeElement.value = this.min.toString();
  }

}