
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType, ScaleType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { default as Annotation } from 'chartjs-plugin-annotation';
import { LoggerService } from 'src/app/services/logger.service';
import { DataBuffer, DataOrigin, BufferMapping, IncomingDataBuffer } from './buffer';
import { ParametersService } from 'src/app/services/parameters.service';
import { transformX, transformY } from 'src/app/services/data-transformers';
import { TimerService } from 'src/app/services/timer.service';
import { ChartConfigurationService } from 'src/app/services/chart.configuration.service';
import { ChartYAxisType } from './chart-types';
import { Datable } from 'src/app/interfaces/datable.interface';
import { IncomingData } from 'src/app/types/data.type';
import { Data } from '@angular/router';
import { BufferHistoryMetadata, HistoryMetadata } from 'src/app/types/buffer-metadata.type';
import { MetaData } from 'ng-event-bus';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements Datable {

  constructor(private params: ParametersService, private timer: TimerService, public chartConfig: ChartConfigurationService) {
    Chart.register(Annotation);
  }
  public active: boolean = true;
  protected _origin: DataOrigin = 'background';

  public chartData: ChartConfiguration['data'] = this.chartConfig.getChartDatasets();
  public chartOptions: ChartConfiguration['options'] = this.chartConfig.getChartOptions();

  // contains data coming from source
  public incomingData: IncomingDataBuffer = { background: [], spectrum: [] };
  // contains data object with assigned channel as x and total value as y
  public rawBuffer: DataBuffer = { background: [], spectrum: [] };
  // contains data object with transformed x and transformed y
  public buffer: DataBuffer = { background: [], spectrum: [] };
  // contains metadata describing buffer content
  protected metadata: BufferHistoryMetadata = { 
    background: { startTime: undefined, realTime: 0, liveTime: 0, deadTime: 0 }, 
    spectrum: { startTime: undefined, realTime: 0, liveTime: 0, deadTime: 0 } 
  };

  @Output() spectrumCapacity = new EventEmitter<number>();
  @Output() backgroundCapacity = new EventEmitter<number>();
  @Input() set origin(value: DataOrigin) {
    this.active = true;
    this._origin = value;
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public setChartType(chartType: ChartType) {
    if (chartType !== 'line' && chartType !== 'scatter' && chartType !== 'bar') {
      throw new Error('Unsupported chart type');
    }
    this.chartConfig.chartType = chartType;
    this.chartData = this.chartConfig.getChartDatasets();
    this.chartOptions = this.chartConfig.getChartOptions();
    this.chart?.render();
    this.rebuild();
  }

  public setYScaleType(scale: ScaleType) {
    this.chartConfig.yAxisScale = scale;
    this.chartData = this.chartConfig.getChartDatasets();
    this.chartOptions = this.chartConfig.getChartOptions();
    this.chart?.render();
    this.rebuild();
  }

  public setYAxisType(yAxisType: ChartYAxisType) {
    this.chartConfig.yAxisType = yAxisType;
    this.chart?.render();
    this.rebuild();
  }

  public updateView(origin?: DataOrigin) {
    let originList: DataOrigin[] = origin ? [origin] : ['background', 'spectrum'];
    originList.forEach((origin) => {
      const originIndex = BufferMapping[origin];
      this.chartData.datasets[originIndex].data = this.buffer[origin];
    });
    this.chart?.update();
  }
  public handleData(data: IncomingData) {
    document.dispatchEvent(new CustomEvent('linkActivityEvent'));
    if (!this.active) {
      return;
    }
    this.incomingData[this._origin] = data;
    this.rebuild(this._origin);
  }

  public activateHandling() {
    this.active = true;
  }

  public deactivateHandling() {
    this.active = false;
  }

  public resetSession() {
    this.active = true;
    this.origin = 'background';
    this.incomingData = { background: [], spectrum: [] };
    this.rebuild();
  }

  public exportBuffer(origin: DataOrigin) {
    const { startTime, realTime, liveTime, deadTime } = this.metadata[origin];
    if (this.rawBuffer[origin].length !== 4095 || !startTime) {
      alert("Data missing or incomplete.");
      return;
    }
    let content =
      `; Generated: ${new Date().toString()}\n` +
      `; Start time: ${new Date(startTime).toString()}\n` +
      `; Origin: ${origin}\n` +
      `; Real time: ${realTime}\n` +
      `; Live time: ${liveTime}\n` +
      `; Dead time: ${deadTime}\n`;
    content += this.rawBuffer[origin]
      .map((a) => Number(a.y))
      .join("\n");

    this.generateDownload(
      `${origin}_${Math.floor(new Date().valueOf() / 1000)}.spe`,
      content
    );
  }

  private generateDownload(filename: string, content: string) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  protected clearBuffer(origin?: DataOrigin) {
    let originList: DataOrigin[] = origin ? [origin] : ['background', 'spectrum'];
    originList.forEach((origin) => {
      this.buffer[origin] = [];
      this.rawBuffer[origin] = [];
    });
  }

  private prepareMetadata(origin: DataOrigin): HistoryMetadata {
    const startTime: number = this.metadata[origin].startTime || new Date().getTime();  
    const { realTime, deadTime, liveTime } = this.timer;
    return {
      startTime, realTime, deadTime, liveTime
    }
  }

  protected fillBuffer(origin?: DataOrigin) {
    let originList: DataOrigin[] = origin ? [origin] : ['background', 'spectrum'];
    originList.forEach((origin) => {
      const data = this.incomingData[origin];
      const settingsDDL = this.params.get('settingsDDL');
      const settingsUDL = this.params.get('settingsUDL');
      if (data.length === 0) {
        return;
      }

      this.metadata[origin] = this.prepareMetadata(origin);
      for (let channel = 0; channel <= 4094; channel++) {

        let x = channel;
        let y = data[x];
        let xTransformed = transformX(x, {});
        let yTransformed = transformY(y, { yAxisType: this.chartConfig.yAxisType, realTime: this.timer.realTime });
        if (channel >= settingsDDL && channel <= settingsUDL) {
          this.buffer[origin].push({
            x: xTransformed,
            y: yTransformed,
          });
        }
        this.rawBuffer[origin].push({
          x: channel,
          y,
        });
      }
    });
  }

  protected rebuild(origin?: DataOrigin) {
    this.spectrumCapacity.emit(this.incomingData['spectrum'].length);
    this.backgroundCapacity.emit(this.incomingData['background'].length);
    this.clearBuffer(origin);
    this.fillBuffer(origin);
    this.updateView(origin);
  }

}