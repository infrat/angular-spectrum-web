export function transformX(x: number, config: object) {
    return x;
}

export function transformY(y: number, { yAxisType, realTime }: { yAxisType: string, realTime: number|undefined }): number {
    if (yAxisType === 'total') {
        return y;
      }
      if (realTime === 0 || !realTime) {
        return 0;
      }
      return Number(y / realTime);
}