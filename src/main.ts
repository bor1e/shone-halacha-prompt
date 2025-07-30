import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeRu from '@angular/common/locales/ru';
import localeHe from '@angular/common/locales/he';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';

// Register locale data
registerLocaleData(localeDe, 'de');
registerLocaleData(localeEn, 'en-US');
registerLocaleData(localeFr, 'fr-FR');
registerLocaleData(localeHe, 'he-IL');
registerLocaleData(localeRu, 'ru-RU');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
