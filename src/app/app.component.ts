import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hackovid-dyb-web-dashboard';

  constructor(
    public translate: TranslateService
  ) {
    translate.addLangs(['ca']);
    translate.setDefaultLang('ca');
  }
}
