import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isDark: boolean;
  themeToggler: HTMLElement;
  themeElement: HTMLElement;
  currentLanguage: any;

  languages: any[] = [
    {
      name: 'English',
      moniker: 'en'
    },
    {
      name: 'Spanish',
      moniker: 'es'
    }
  ]

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService) {
    this.themeElement = document.getElementById('theme-style');
    this.isDark = localStorage.getItem('isDark') == 'yes';
    this.themeElement.setAttribute('href', this.isDark ? 'https://bootswatch.com/4/cyborg/bootstrap.min.css' : 'https://bootswatch.com/4/flatly/bootstrap.min.css');

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    //translate.use('en');
    this.setLanguage(localStorage.getItem('lang') || 'en');
  }

  setLanguage(lang: string): void {
    const language = this.languages.find(x => x.moniker == lang);
    if (language) {
      this.translate.use(language.moniker);
      this.currentLanguage = language;
      localStorage.setItem("lang", language.moniker);
    }
  }

  getLanguage(): any {
    return this.currentLanguage;
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('isDark', this.isDark ? 'yes' : 'no');
    this.themeElement.setAttribute('href', this.isDark ? 'https://bootswatch.com/4/cyborg/bootstrap.min.css' : 'https://bootswatch.com/4/flatly/bootstrap.min.css');
  }
}
