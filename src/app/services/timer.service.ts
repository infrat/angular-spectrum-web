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
  public realTime: number = 0;
  public liveTime: number = 0;
  public deadTime: number = 0;
  public timerActive: boolean = false;

  constructor(private eventBus: NgEventBus) { }

  private tick() {
    if (!this.startTime) {
      return;
    }
    const currTime = new Date().getTime();
    this.realTime = Math.floor((currTime - this.startTime) / 1000);
    this.eventBus.cast(EventsEnum.GLOBAL_TIMER_TICK);
  }
  public startTimer() {
    this.startTime = new Date().getTime();
    this.timerActive = true;
    this.timer = setInterval(() => this.tick(), this.INTERVAL);
  }
  public stopTimer() {
    this.timerActive = false;
    clearInterval(this.timer);
  }
  public resetTimer() {
    const timerActive = this.timerActive;
    this.stopTimer();
    this.realTime = 0;
    this.liveTime = 0;
    this.deadTime = 0;
    this.startTimer();
  }
}
