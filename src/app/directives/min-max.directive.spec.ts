import { ElementRef } from '@angular/core';
import { MinMaxDirective } from './min-max.directive';

describe('MinMaxDirective', () => {
  it('should create an instance', () => {
    const ref = {} as ElementRef;
    const directive = new MinMaxDirective(ref);
    expect(directive).toBeTruthy();
  });
});
