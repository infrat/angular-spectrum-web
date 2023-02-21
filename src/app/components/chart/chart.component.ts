
import { Component, Input, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType, ScaleType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { default as Annotation } from 'chartjs-plugin-annotation';
import { LoggerService } from 'src/app/services/logger.service';
import { DataBuffer, DataOrigin, BufferMapping } from './buffer';
import { ParametersService } from 'src/app/services/parameters.service';
import { transformX, transformY } from 'src/app/services/data-transformers';
import { TimerService } from 'src/app/services/timer.service';
import { ChartConfigurationService } from 'src/app/services/chart.configuration.service';
import { ChartYAxisType } from './chart-types';
import { Datable } from 'src/app/interfaces/datable.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements Datable {

  constructor(private logger: LoggerService, private params: ParametersService, private timer: TimerService, public chartConfig: ChartConfigurationService) {
    Chart.register(Annotation);
  }
  // contains data coming from source
  public incomingData: DataBuffer = { background: [], spectrum: [] };
  
  // contains data object with assigned channel as x and total value as y
  public rawBuffer: DataBuffer = { background: [], spectrum: [] };

  // contains data object with transformed x and transformed y
  public buffer: DataBuffer = { background: [], spectrum: [] };
  public active: boolean = true;
  protected _origin: DataOrigin = 'background';
  
  public chartData: ChartConfiguration['data'] = this.chartConfig.getChartDatasets();
  public chartOptions: ChartConfiguration['options'] = this.chartConfig.getChartOptions();

  @Input() set origin(value: DataOrigin) {
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

  protected clearBuffer(origin?: DataOrigin) {
    let originList: DataOrigin[] = origin ? [ origin ] : [ 'background', 'spectrum' ];
    originList.forEach((origin) => {
      this.buffer[origin] = [];
      this.rawBuffer[origin] = [];
    });
  }

  protected fillBuffer(origin?: DataOrigin) {
    let originList: DataOrigin[] = origin ? [ origin ] : [ 'background', 'spectrum' ];
    originList.forEach((origin) => {
      const data = this.incomingData[origin];
      const settingsDDL = this.params.get('settingsDDL');
      const settingsUDL = this.params.get('settingsUDL');
      if (data.length === 0) {
        return;
      }
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

  public updateView(origin?: DataOrigin) {
    let originList: DataOrigin[] = origin ? [ origin ] : [ 'background', 'spectrum' ];
    originList.forEach((origin) => {
      const originIndex = BufferMapping[origin];
      this.chartData.datasets[originIndex].data = this.buffer[origin];
    });
    this.chart?.update(); 
  }

  protected rebuild(origin?: DataOrigin) {
    this.clearBuffer(origin);
    this.fillBuffer(origin);
    this.updateView(origin);
  }

  public handleData(data: Array<number>) {
    document.dispatchEvent(new CustomEvent('linkActivityEvent'));
    data.shift();
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

}