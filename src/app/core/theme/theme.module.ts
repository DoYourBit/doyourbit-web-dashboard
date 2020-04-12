import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  NbThemeModule,
} from '@nebular/theme';
import { DEFAULT_THEME } from './theme.default';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'dark',
          },
          [ DEFAULT_THEME, DEFAULT_THEME, DEFAULT_THEME, DEFAULT_THEME ],
        ).providers,
      ],
    };
  }
}
