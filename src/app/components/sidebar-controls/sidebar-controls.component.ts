import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { ConnectionStatusEnum } from '../../connection.status.enum';
import { SerialDataSourceService } from '../../services/data-sources/serial.data-source.service';
import { OutletContext } from '@angular/router';
import { DataOrigin } from '../chart/buffer';
import { Timeable } from 'src/app/interfaces/timeable.interface';
import { TimerService } from 'src/app/services/timer.service';
import { NgEventBus } from 'ng-event-bus';
import { EventsEnum } from 'src/app/events.enum';

@Component({
  selector: 'app-sidebar-controls',
  templateUrl: './sidebar-controls.component.html',
  styleUrls: ['./sidebar-controls.component.scss']
})
export class SidebarControlsComponent implements Timeable {
  protected connectionStatus: typeof ConnectionStatusEnum = ConnectionStatusEnum;
  protected backgroundRt: number = 0;
  protected spectrumRt: number = 0;
  protected origin: DataOrigin = 'background';
  protected acqTimeout: number = 0;
  protected acqTimeoutEnabled: boolean = false;
  protected acqTimeoutValue: number = 0;
  @Output() setOrigin = new EventEmitter<DataOrigin>();

  constructor(private modalService: NgbModal, protected dataSource: SerialDataSourceService, protected timer: TimerService, private eventBus: NgEventBus) {}
  connect() {
    this.dataSource.connect();
  }

  enableRegime(acqTimeoutValue: number) {
    this.acqTimeoutEnabled = !this.acqTimeoutEnabled;
    this.acqTimeout = acqTimeoutValue;
  }

  acqBackground() {
    this.origin = 'background';
    this.setOrigin.emit('background');
  }

  acqSpectrum() {
    this.origin = 'spectrum';
    this.setOrigin.emit('spectrum');
  }

  openSettings() {
    const modalRef = this.modalService.open(SettingsModalComponent, { windowClass: 'modal-xl' });
  }

  handleTick() {
    if (!this.timer.realTime) {
      return;
    }
    if (this.acqTimeoutEnabled) {
      this.acqTimeout = this.acqTimeoutValue - this.timer.realTime;
      if (this.acqTimeout <= 0) {
        this.eventBus.cast(EventsEnum.GLOBAL_TIMER_STOP);
      }
    }
    if (this.origin === 'background') {
      this.backgroundRt = this.timer.realTime;
    }
    if (this.origin === 'spectrum') {
      this.spectrumRt = this.timer.realTime;
    }
  }
}
