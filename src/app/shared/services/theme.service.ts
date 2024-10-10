import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional, Renderer2, RendererFactory2, signal } from '@angular/core';
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('light');

  private STORAGE_THEME_KEY = 'theme';
  private DEFAULT_THEME: Theme = 'light';

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Optional() @Inject(LOCAL_STORAGE) private storage?: Storage,
    @Optional() @Inject(WINDOW) private window?: Window,
    @Optional() @Inject(DOCUMENT) private document?: Document,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    const theme = this.getTheme();
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  setTheme(theme: Theme): void {
    if (!this.storage) {
      return;
    }

    this.theme.set(theme);
    this.storage.setItem(this.STORAGE_THEME_KEY, theme);
    this.applyTheme(theme);
  }
  private getTheme(): Theme {
    if (!this.storage || !this.window) {
      return this.DEFAULT_THEME;
    }

    const theme = this.storage.getItem(this.STORAGE_THEME_KEY) as Theme | null;

    if (theme) {
      return theme;
    }

    return this.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme) {
    if (!this.document) {
      return;
    }

    if (theme === 'dark') {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
    }
  }
}
