import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';
import { NgEventBus } from 'ng-event-bus';
import { SidebarControlsComponent } from './components/sidebar-controls/sidebar-controls.component';
import { SidebarStatusComponent } from './components/sidebar-status/sidebar-status.component';
import { TimerService } from './services/timer.service';
import { LinkActivityDirective } from './components/sidebar-status/link.activity.directive';
import { TimerActivityDirective } from './components/sidebar-status/timer.activity.directive';
import { MinMaxDirective } from './directives/min-max.directive';
import { PositiveIntegersDirective } from './directives/positive-integers.directive';
import { IntegersDirective } from './directives/integers.directive';
import { FloatsDirective } from './directives/floats.directive';
import { FormsModule } from '@angular/forms';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    SidebarControlsComponent,
    SidebarStatusComponent,
    LinkActivityDirective,
    TimerActivityDirective,
    MinMaxDirective,
    PositiveIntegersDirective,
    IntegersDirective,
    FloatsDirective,
    SettingsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgChartsModule,
    FormsModule
  ],
  providers: [
    NgEventBus,
    TimerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
