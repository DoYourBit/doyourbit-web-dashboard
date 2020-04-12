import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hackovid-dyb-web-dashboard';

  constructor(
    public translate: TranslateService,
    private themeService: NbThemeService
  ) {
    // this.themeService.changeTheme('dark')
    translate.addLangs(['ca']);
    translate.setDefaultLang('ca');
  }
}
