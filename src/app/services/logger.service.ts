import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  info(message: string) {
    console.log(`[${new Date().toLocaleString('pl-PL')}] :: [INFO] ${message}`);
  }
  error(message: string, displayAlert?: boolean) {
      console.log(`[${new Date().toLocaleString('pl-PL')}] :: [ERROR] ${message}`);
      if (displayAlert) {
        alert(message);
      }
  }
  debug(message: string) {
      console.log(`[${new Date().toLocaleString('pl-PL')}] :: [DEBUG] ${message}`);
  }
}
