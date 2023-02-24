import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  protected backgroundExportReady: boolean = false; 
  protected spectrumExportReady: boolean = false; 
  
  protected acqTimeout: number = 0;
  protected acqTimeoutEnabled: boolean = false;
  protected acqTimeoutValue: number = 0;
  @Output() setOrigin = new EventEmitter<DataOrigin>();
  @Output() exportBuffer = new EventEmitter<DataOrigin>();

  constructor(private modalService: NgbModal, protected dataSource: SerialDataSourceService, protected timer: TimerService, private eventBus: NgEventBus) {}
  public connect() {
    this.dataSource.connect();
  }

  public resetSessionTrigger() {
    this.eventBus.cast(EventsEnum.RESET_SESSION);
  }

  public setRegime(acqTimeoutValue: number) {
    if (!this.timer.realTime) {
      return;
    }
    if (this.acqTimeoutEnabled && acqTimeoutValue <= this.timer.realTime) {
      this.acqTimeoutValue = this.acqTimeout;
      return;
    }
    this.acqTimeout = acqTimeoutValue;
  }

  public toggleRegime(acqTimeoutValue: number) {
    if (!this.acqTimeoutEnabled && acqTimeoutValue <= this.timer.realTime) {
      alert('ACQ Timeout value must be greater than actual Real Time value');
      return;
    }
    this.acqTimeoutEnabled = !this.acqTimeoutEnabled;
    this.acqTimeout = acqTimeoutValue;
  }

  public acqBackground() {
    this.origin = 'background';
    this.setOrigin.emit('background');
    if (this.dataSource.castActive) {
      this.timer.resetTimer();
      this.dataSource.clearBuffer();
    }
  }

  public acqSpectrum() {
    this.origin = 'spectrum';
    this.setOrigin.emit('spectrum');
    if (this.dataSource.castActive) {
      this.timer.resetTimer();
      this.dataSource.clearBuffer();
    }
  }

  public acquire(origin: DataOrigin) {
    this.origin = origin;
    this.setOrigin.emit(origin);
    if (this.dataSource.castActive) {
      this.timer.resetTimer();
      this.dataSource.clearBuffer();
    }
  }

  public export(origin: DataOrigin) {
    this.exportBuffer.emit(origin);
  }

  public setSpectrumCapacity(value: number) {
    this.spectrumExportReady = value > 0;
  }

  setBackgroundCapacity(value: number) {
    this.backgroundExportReady = value > 0;
  }

  openSettings() {
    const modalRef = this.modalService.open(SettingsModalComponent, { windowClass: 'modal-xl' });
  }

  handleTick() {
    if (!this.timer.realTime) {
      return;
    }
    if (this.acqTimeoutEnabled) {
      if (this.acqTimeout <= this.timer.realTime) {
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

  resetSession() {
    this.dataSource.clearBuffer();
    this.backgroundRt = 0;
    this.spectrumRt = 0;
    this.origin = 'background';
    this.acqTimeout = this.acqTimeoutValue;
  }
}
