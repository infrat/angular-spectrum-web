import { Injectable } from '@angular/core';
import { AppParameters, defaultParameters as defaults } from '../configuration/default-parameter';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  constructor() { }
  public get(key: keyof AppParameters): string | boolean | number {
    const type = typeof(defaults[key]);
    if (type === 'string') {
      return localStorage.getItem(key) || defaults[key];
    }
    if (type === 'number') {
      return Number(localStorage.getItem(key) as string) || defaults[key];
    }
    if (type === 'boolean') {
      return localStorage.getItem(key) ? localStorage.getItem(key) === 'true' : defaults[key];
    }
    throw new Error('Missing configuration key');
  }
  public set<K extends keyof AppParameters, V extends AppParameters[K]>(key: K, value: V) {
    localStorage.setItem(key, value.toString());
  }

  public persist(params: AppParameters) {
    let property: keyof AppParameters;
    for (property in params) {
      this.set(property, params[property]);
    }
  }

}
