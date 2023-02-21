import { Injectable } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { EventsEnum } from '../events.enum';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private INTERVAL = 1000;

  public startTime: number = 0;
  private timer: any;
  public realTime: number|undefined;
  public liveTime: number = 0;
  public deadTime: number = 0;

  constructor(private eventBus: NgEventBus) { }

  tick() {
    if (!this.startTime) {
      return;
    }
    const currTime = new Date().getTime();
    this.realTime = Math.floor((currTime - this.startTime) / 1000);
    this.eventBus.cast(EventsEnum.GLOBAL_TIMER_TICK);
  }
  startTimer() {
    this.startTime = new Date().getTime();
    this.timer = setInterval(() => this.tick(), this.INTERVAL);
  }
  stopTimer() {
    clearInterval(this.timer);
  }
  resetTimer() {}
}
