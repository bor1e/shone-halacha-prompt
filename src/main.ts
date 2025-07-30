import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeRu from '@angular/common/locales/ru';
import localeHe from '@angular/common/locales/he';
import localeDe from '@angular/common/locales/de';

// Register locale data
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeRu, 'ru');
registerLocaleData(localeHe, 'he');
registerLocaleData(localeDe, 'de');
registerLocaleData(localeDe, 'en');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
