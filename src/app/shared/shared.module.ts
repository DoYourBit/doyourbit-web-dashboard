import { NgModule } from '@angular/core';
import { EvaIconsPipe } from './pipes/eva-icons.pipe';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NbIconModule, NbCardModule } from '@nebular/theme';


@NgModule({
  declarations: [
    EvaIconsPipe,
    MetricCardComponent
  ],
  imports: [
    TranslateModule,
    NbIconModule,
    NbCardModule,
  ],
  exports: [
    EvaIconsPipe,
    MetricCardComponent,
    TranslateModule
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule { }
