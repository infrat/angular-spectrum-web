import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Datable } from 'src/app/interfaces/datable.interface';
import { Timeable } from 'src/app/interfaces/timeable.interface';
import { CpsService } from 'src/app/services/cps.service';
import { LoggerService } from 'src/app/services/logger.service';
import { TimerService } from 'src/app/services/timer.service';
import { IncomingData } from 'src/app/types/data.type';

@Component({
  selector: 'app-sidebar-status',
  templateUrl: './sidebar-status.component.html',
  styleUrls: ['./sidebar-status.component.scss']
})
export class SidebarStatusComponent implements Timeable, Datable {
  protected realTime: number = 0;
  protected liveTime: number = 0;
  protected rawDeadTime: number = 0;
  protected deadTime: number = 0;

  protected cps: number = 0;
  constructor(private logger: LoggerService, private timer: TimerService, private cpsService: CpsService) {}
  public handleTick() {
    document.dispatchEvent(new CustomEvent('timerActivityEvent'));
    const time = new Date().getTime();
    this.realTime = Math.floor((time - this.timer.startTime) / 1000);
    if (!this.cps) {
      return;
    }
    this.rawDeadTime = this.cps * 0.00033;
    this.timer.liveTime = this.liveTime = this.realTime - this.realTime * this.rawDeadTime;
    this.timer.deadTime = this.deadTime = Math.round(this.rawDeadTime * 10000) / 100;

  }

  public handleData(data: IncomingData) {
    this.cps = this.cpsService.calculate(data);
  }

  public resetSession() {
    this.realTime = 0;
    this.liveTime = 0;
    this.rawDeadTime = 0;
    this.deadTime = 0;
    this.cps = 0;
  }
}
