import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartType, ScaleType } from 'chart.js';
import { ChartYAxisType, ChartXAxisType } from '../components/chart/chart-types';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigurationService {

  public yAxisType: ChartYAxisType = 'total';
  public xAxisType: ChartXAxisType = 'channel';
  public yAxisScale: ScaleType = 'linear';
  public xAxisScale: ScaleType = 'linear';
  public chartType: ChartType = 'scatter';
  
  protected scatterDatasets: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        borderColor: "rgba(99,0,125, .2)",
        backgroundColor: "rgba(99,0,125, .5)",
        pointBorderColor: "rgba(99,0,125, .2)",
        pointBackgroundColor: "rgba(99,0,125, .5)",
        pointRadius: 2
      },
      {
        data: [],
        borderColor: "rgba(0,0,0, .2)",
        backgroundColor: "rgba(0,0,0, .5)",
        pointBorderColor: "rgba(0,0,0, .2)",
        pointBackgroundColor: "rgba(0,0,0, .5)",
        pointRadius: 2
      }
    ]
  };
  
  protected scatterOptions: ChartConfiguration['options'] = {
    interaction: { 
      mode: 'nearest' 
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { 
      tooltip: {
        intersect: false
      },
      legend: { display: false },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true
        }
      }
    },
    scales: {
      x: {
        type: this.xAxisScale,
        position: 'bottom',
      },
      y: {
        type: this.yAxisScale,
        position: 'bottom',
        // ticks: {
        //   callback: function (value, index, values) {
        //     return Number(value.toString());
        //   },
        // },
      },
    },
  };
  
  protected lineDatasets: ChartConfiguration['data'] = {
      datasets: [
        {
          data: [],
          borderColor: "rgba(99,0,125, .2)",
          backgroundColor: "rgba(99,0,125, .5)",
          pointBorderColor: "rgba(99,0,125, .2)",
          pointBackgroundColor: "rgba(99,0,125, .5)",
        },
        {
          data: [],
          borderColor: "rgba(99,99,99, .2)",
          backgroundColor: "rgba(99,99,99, .5)",
          pointBorderColor: "rgba(99,99,99, .2)",
          pointBackgroundColor: "rgba(99,99,99, .5)",
        }
      ]
  };
  
  protected lineOptions: ChartConfiguration['options'] = {
    interaction: { 
      mode: 'nearest' 
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { 
      tooltip: { intersect: false },
      legend: { display: false } 
    },
    scales: {
      x: {
        type: this.xAxisScale,
        position: 'bottom',
      },
      y: {
        type: this.yAxisScale,
        position: 'bottom',
        ticks: {
          callback: function (value, index, values) {
            return Number(value.toString());
          },
        },
      },
    },
  };
  
  protected barDatasets: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        borderColor: "rgba(255,0,0, .2)",
        backgroundColor: "rgba(255,0,0, .5)",
        pointBorderColor: "rgba(255,0,0, .2)",
        pointBackgroundColor: "rgba(255,0,0, .5)",
      },
      {
        data: [],
        borderColor: "rgba(30,30,30, .2)",
        backgroundColor: "rgba(30,30,30, .5)",
        pointBorderColor: "rgba(30,30,30, .2)",
        pointBackgroundColor: "rgba(30,30,30, .5)",
      }
    ]
  };
  
  protected barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        intersect: false
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false
      },
      y: {
        stacked: false,
        type: this.yAxisScale,
        position: 'bottom',
        ticks: {
          callback: function (value, index, values) {
            return Number(value.toString());
          },
        },
      },
    },
  };

  private chartConfiguration = {
    scatter: { datasets: this.scatterDatasets, options: this.scatterOptions },
    line: { datasets: this.lineDatasets, options: this.lineOptions },
    bar: { datasets: this.barDatasets, options: this.barOptions }
  }
  constructor() { }

  public applyDynamicOptions(config: { datasets: ChartConfiguration['data'], options: ChartConfiguration['options'] }) {
    const { options } = config;
    if (options?.scales?.['y']) {
      options.scales['y'].type = this.yAxisScale;
    }
    if (options?.scales?.['x']) {
      options.scales['x'].type = this.xAxisScale;
    }
  }
  public getChartDatasets() {
    if (this.chartType !== 'line' && this.chartType !== 'scatter' && this.chartType !== 'bar') {
      throw new Error('Unsupported chart type');
    }
    const config = this.chartConfiguration[this.chartType];
    this.applyDynamicOptions(config);
    return config.datasets;
  }

  public getChartOptions() {
    if (this.chartType !== 'line' && this.chartType !== 'scatter' && this.chartType !== 'bar') {
      throw new Error('Unsupported chart type');
    }
    const config = this.chartConfiguration[this.chartType];
    this.applyDynamicOptions(config);
    return config.options;
  }
}
