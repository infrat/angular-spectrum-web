import { Component, ViewChild } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { DataOrigin } from './components/chart/buffer';
import { ChartComponent } from './components/chart/chart.component';
import { SidebarControlsComponent } from './components/sidebar-controls/sidebar-controls.component';
import { SidebarStatusComponent } from './components/sidebar-status/sidebar-status.component';
import { ConnectionStatusEnum } from './connection.status.enum';
import { EventsEnum } from './events.enum';
import { TimerService } from './services/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(ChartComponent) chart!: ChartComponent;
  @ViewChild(SidebarStatusComponent) sidebarStatus!: SidebarStatusComponent;
  @ViewChild(SidebarControlsComponent) sidebarControls!: SidebarControlsComponent;
  protected connectionStatus: typeof ConnectionStatusEnum = ConnectionStatusEnum;

  title = 'angular-spectrum-web';
  constructor(private eventBus: NgEventBus, private timer: TimerService) {
    this.setupSubscriptions();
  }

  setOrigin(origin: DataOrigin) {
    this.chart.origin = origin;
  }

  setupSubscriptions() {
    this.eventBus.on(EventsEnum.GLOBAL_TIMER_TICK).subscribe(() => {
      this.sidebarStatus.handleTick();
      this.sidebarControls.handleTick();
    });
    this.eventBus.on(EventsEnum.GLOBAL_TIMER_START).subscribe(() => { 
      this.timer.startTimer();
      this.chart.activateHandling();
    });
    this.eventBus.on(EventsEnum.GLOBAL_TIMER_STOP).subscribe(() => {
      this.timer.stopTimer()
      this.chart.deactivateHandling();
    });
    this.eventBus.on(EventsEnum.INCOMING_DATA).subscribe(({ data }) => { 
      this.chart.handleData(data);
      this.sidebarStatus.handleData(data)
    });
  }
}
