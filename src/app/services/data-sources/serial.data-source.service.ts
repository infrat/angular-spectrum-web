/// <reference types="w3c-web-serial" />

import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { DataSourceService } from './data-source.service';
import { serial as serialConfig } from '../../configuration/data-source';
import { globals as globalConfig } from 'src/app/configuration/globals';
import { ParametersService } from '../parameters.service';
import { NgEventBus } from 'ng-event-bus';
import { EventsEnum } from 'src/app/events.enum';
import { ConnectionStatusEnum } from 'src/app/connection.status.enum';

@Injectable({
  providedIn: 'root'
})
export class SerialDataSourceService implements DataSourceService {
  
  private port: any;
  private writer: any;
  private handlerTimeout: any;

  constructor(private logger: LoggerService, private params: ParametersService, private eventBus: NgEventBus) { }

  connectToggle = true;
  connectionStatus = ConnectionStatusEnum.DISCONNECTED;

  async connect() {
    try {
      // Prompt user to select any serial port.
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: serialConfig.BAUDRATE });

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(this.port.writable);
      this.writer = textEncoder.writable.getWriter();
      if (this.params.get('autoReset')) {
        this.clearSpectrumBuffer();
      }
      this.connectionStatus = ConnectionStatusEnum.CONNECTED;
      this.eventBus.cast(EventsEnum.DEVICE_CONNECTED);
      this.eventBus.cast(EventsEnum.GLOBAL_TIMER_START);
      await this.listenToPort();
    } catch (e) {
      this.connectionStatus = ConnectionStatusEnum.DISCONNECTED;
      this.logger.error("Serial Connection Failed" + e, true);
    }
  }

  clearSpectrumBuffer() {
    this.writer.write("clear spectrum\r\n");
    this.eventBus.cast(EventsEnum.GLOBAL_TIMER_RESET);
  }

  async listenToPort() {
    let output = "";
    const textDecoder = new TextDecoderStream();
    this.port.readable.pipeTo(
      textDecoder.writable
    );
    const reader = textDecoder.readable.getReader();
    let serialTimeout: any;
    
    try {
      // Listen to data coming from the serial device.
      while (true) {
        
        if (!serialTimeout) {
          serialTimeout = this.enableTimeout();
        }
        
        const { value, done } = await reader.read();
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        output += value.replace(globalConfig.DATA_FILTER, "");
        if (!this.handlerTimeout) {
          this.handlerTimeout = setTimeout(() => {
            const data = output.split(globalConfig.DATA_SPLIT).filter(Boolean);
            this.logger.info(`Values count: ${data.length}`);

            if (data.length === globalConfig.VALUES_COUNT) {
              clearTimeout(serialTimeout);
              this.cast(data);
              output = "";
            }
            // failover
            if (data.length > globalConfig.VALUES_COUNT) {
              this.logger.info(`Failover!`);
              output = "";
            }
            this.handlerTimeout = null;
          }, 500);
        }
      }
    } catch (e) {
      this.eventBus.cast(EventsEnum.DEVICE_DISCONNECTED);
      this.eventBus.cast(EventsEnum.GLOBAL_TIMER_STOP);
      this.connectionStatus = ConnectionStatusEnum.DISCONNECTED;
      this.logger.error("Connection lost: " + e, true);
    }
  }

  enableTimeout() {
    return setTimeout(() => {
      this.logger.error('Data timeout error.', true);
    }, 5000);
  }

  cast(data: any) {
    this.eventBus.cast(EventsEnum.INCOMING_DATA, data.map((value: string) => parseInt(value)));
  }

  close() {
    
  }

}
