import { Directive, ElementRef, HostListener } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[appTimerActivity]'
})
export class TimerActivityDirective {

  constructor(private el: ElementRef) {
  }
  
  @HostListener('document:timerActivityEvent') onTimerActivity() {
    this.highlight('red');
    timer(200).subscribe(() => this.highlight('gray'));
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
