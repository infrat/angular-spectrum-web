import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  public info(message: string) {
    console.log(`[${new Date().toLocaleString('pl-PL')}] :: [INFO] ${message}`);
  }
  public error(message: string, displayAlert?: boolean) {
      console.log(`[${new Date().toLocaleString('pl-PL')}] :: [ERROR] ${message}`);
      if (displayAlert) {
        alert(message);
      }
  }
  public debug(message: string) {
      console.log(`[${new Date().toLocaleString('pl-PL')}] :: [DEBUG] ${message}`);
  }
}
