import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Datable } from 'src/app/interfaces/datable.interface';
import { Timeable } from 'src/app/interfaces/timeable.interface';
import { CpsService } from 'src/app/services/cps.service';
import { LoggerService } from 'src/app/services/logger.service';
import { TimerService } from 'src/app/services/timer.service';

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
    if (!this.cps) {
      return;
    }
    const time = new Date().getTime();
    this.rawDeadTime = this.cps * 0.00033;
    this.realTime = Math.floor((time - this.timer.startTime) / 1000);
    this.liveTime = this.realTime - this.realTime * this.rawDeadTime;
    this.deadTime = Math.round(this.rawDeadTime * 10000) / 100;

  }

  public handleData(data: any) {
    this.cps = this.cpsService.calculate(data);
  }
}
