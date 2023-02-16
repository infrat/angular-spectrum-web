import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-spectrum-web';
  constructor(private modalService: NgbModal) {}

  openSettings() {
    const modalRef = this.modalService.open(SettingsModalComponent, { windowClass: 'modal-xl' });
  }
}
