import { NgModule } from '@angular/core';
import { EvaIconsPipe } from './pipes/eva-icons.pipe';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NbIconModule, NbCardModule, NbListModule } from '@nebular/theme';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    EvaIconsPipe,
    MetricCardComponent,
    TicketDetailComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NbIconModule,
    NbCardModule,
    NbListModule
  ],
  exports: [
    EvaIconsPipe,
    MetricCardComponent,
    TicketDetailComponent,
    TranslateModule
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule { }
