import { Injectable } from '@angular/core';

export interface DataSourceService {
  cast(data: any): any;
}
