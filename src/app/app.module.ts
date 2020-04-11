import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NgxEchartsModule } from 'ngx-echarts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbIconModule, NbCardModule, NbButtonModule, NbInputModule, NbSpinnerModule, NbListModule, NbThemeService, NbDialogModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DonateComponent } from './pages/dashboard/donate/donate.component';
import { SharedModule } from './shared/shared.module';
import { Web3Service } from './core/web3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './pages/dashboard/dashboard.service';
import { ChartComponent } from './pages/dashboard/chart/chart.component';
import { ThemeModule } from './core/theme/theme.module';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DonateComponent,
    ChartComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxEchartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    ThemeModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSpinnerModule,
    NbListModule,
    NbDialogModule.forRoot()
  ],
  providers: [
    DashboardService,
    Web3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
