import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpsService {

  constructor() { }

  private oldCounts: { counts: number, timestamp: Date } | undefined;
  public cps: number = 0;

  public calculate(data: any): number {
    const counts = data.reduce((sum: number, a: number) => sum + a, 0);

    if (this.oldCounts) {
      const msDelta = (new Date).getTime() - this.oldCounts.timestamp.getTime();
      // this method might not be called exactly each 1s (runtime can't guarantee that)
      if (msDelta > 1000 && msDelta < 1300) {
        if (counts - this.oldCounts.counts > 0) {
          this.cps = counts - this.oldCounts.counts;
        }
      }
    }
    this.oldCounts = { counts, timestamp: new Date() };
    return this.cps;
  }
}
