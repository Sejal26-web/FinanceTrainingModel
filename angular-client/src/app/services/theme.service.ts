import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSignal = signal<string>(this.getInitialTheme());

  theme = this.themeSignal.asReadonly();
  isDark = computed(() => this.themeSignal() === 'dark');

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    });
  }

  private getInitialTheme(): string {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggleTheme() {
    this.themeSignal.update(t => t === 'light' ? 'dark' : 'light');
  }
}
