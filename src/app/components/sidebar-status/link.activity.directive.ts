import { Directive, ElementRef, HostListener } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[appLinkActivity]'
})
export class LinkActivityDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('document:linkActivityEvent') onLinkActivity() {
    this.highlight('green');
    timer(200).subscribe(() => this.highlight('gray'));
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
