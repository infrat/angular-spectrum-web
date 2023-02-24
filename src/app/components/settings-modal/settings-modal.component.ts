import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppParameters, defaultParameters } from 'src/app/configuration/default-parameter';
import { ParametersService } from 'src/app/services/parameters.service';
import { SettingsModel } from './settings.model';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

  public model = new SettingsModel(
    this.params.get('autoReset') as boolean,
    this.params.get('UDL') as number,
    this.params.get('DDL') as number,
    this.params.get('averaging') as number,
    this.params.get('channelA') as number,
    this.params.get('channelB') as number,
    this.params.get('channelC') as number,
    this.params.get('energyA') as number,
    this.params.get('energyB') as number,
    this.params.get('energyC') as number,
    this.params.get('ratioA') as number,
    this.params.get('ratioB') as number,
  );

  public calibrationIsDirty = false;

  constructor(public activeModal: NgbActiveModal, public params: ParametersService) { }

  ngOnInit(): void {
  }

  dirtify(field: keyof AppParameters, newValue: number) {
    const oldValue = this.params.get(field);
    console.log(oldValue);
    if (newValue === oldValue) {
      this.calibrationIsDirty = false;
      return;
    }
    this.calibrationIsDirty = true;
  }

  private avg(arr: number[]) {
    return arr.reduce((p, c) => p + c, 0) / arr.length;
  }

  public calibrate() {
    const { channelA, channelB, channelC, energyA, energyB, energyC } = this.model.data;
    const x = [
      channelA,
      channelB,
      channelC
    ];

    const y = [
      energyA,
      energyB,
      energyC
    ];

    const aNum =
      x[0] * y[0] + x[1] * y[1] + x[2] * y[2] - 3 * this.avg(x) * this.avg(y);
    const aDen =
      x[0] * x[0] + x[1] * x[1] + x[2] * x[2] - 3 * this.avg(x) * this.avg(x);
    const a = aNum / aDen;

    const b = this.avg(y) - a * this.avg(x);
    this.model.data.ratioA = a;
    this.model.data.ratioB = b;
    this.calibrationIsDirty = false;
  }

  public onSubmit(form: NgForm) {
    if (this.calibrationIsDirty || !form.valid) {
      return;
    }
    this.params.persist(this.model.data);
    window.location.reload();
  }

}
