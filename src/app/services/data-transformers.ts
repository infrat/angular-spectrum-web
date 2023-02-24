import { ChartXAxisType, ChartYAxisType } from "../components/chart/chart-types";

export function transformX(x: number, { xAxisType, ratioA, ratioB }: { xAxisType: ChartXAxisType, ratioA: number, ratioB: number }) {
  if (xAxisType === 'energy') {
    return ratioA * x + ratioB;
  }
  return x
}

export function transformY(y: number, { yAxisType, realTime }: { yAxisType: ChartYAxisType, realTime: number|undefined }): number {
    if (yAxisType === 'total') {
        return y;
      }
      if (realTime === 0 || !realTime) {
        return 0;
      }
      return Number(y / realTime);
}