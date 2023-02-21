import { Injectable } from '@angular/core';
import { defaultParameters as defaults } from '../configuration/default-parameter';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  constructor() { }
  get(key: keyof typeof defaults): string | number | boolean {
    return localStorage.getItem(key) || defaults[key];
  }
}
