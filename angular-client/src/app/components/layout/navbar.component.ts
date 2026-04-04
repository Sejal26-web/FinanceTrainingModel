import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 glass-card border-b rounded-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <a routerLink="/" class="flex items-center group">
            <span class="text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              LoanPredict AI
            </span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            <a *ngFor="let link of visibleLinks"
               [routerLink]="link.to"
               routerLinkActive="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
               [routerLinkActiveOptions]="{ exact: link.to === '/' }"
               class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5">
              <span>{{ link.icon }}</span>
              {{ link.label }}
            </a>
          </div>

          <!-- Auth + Theme Toggle -->
          <div class="hidden md:flex items-center gap-3">
            <button (click)="themeService.toggleTheme()"
                    class="p-2 rounded-lg t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Toggle theme">
              {{ themeService.isDark() ? '☀️' : '🌙' }}
            </button>

            <ng-container *ngIf="auth.isLoggedIn(); else guestLinks">
              <span class="t-text-muted text-sm">
                Hi, <span class="t-text font-medium">{{ auth.user()?.name?.split(' ')[0] }}</span>
              </span>
              <button (click)="handleLogout()"
                      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                🚪 Logout
              </button>
            </ng-container>
            <ng-template #guestLinks>
              <a routerLink="/login"
                 class="px-4 py-2 rounded-lg text-sm t-text-secondary hover:t-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Sign In
              </a>
              <a routerLink="/register"
                 class="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Sign Up
              </a>
            </ng-template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex md:hidden items-center gap-2">
            <button (click)="themeService.toggleTheme()" class="p-2 rounded-lg t-text-muted" aria-label="Toggle theme">
              {{ themeService.isDark() ? '☀️' : '🌙' }}
            </button>
            <button (click)="mobileOpen = !mobileOpen" class="t-text-muted hover:t-text p-2">
              {{ mobileOpen ? '✕' : '☰' }}
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="mobileOpen" class="md:hidden pb-4 border-t t-border mt-2 pt-4 space-y-1">
          <a *ngFor="let link of visibleLinks"
             [routerLink]="link.to"
             routerLinkActive="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
             [routerLinkActiveOptions]="{ exact: link.to === '/' }"
             (click)="mobileOpen = false"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5">
            <span>{{ link.icon }}</span>
            {{ link.label }}
          </a>
          <div class="border-t t-border pt-3 mt-3">
            <ng-container *ngIf="auth.isLoggedIn(); else mobileGuest">
              <button (click)="handleLogout()"
                      class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full">
                🚪 Logout
              </button>
            </ng-container>
            <ng-template #mobileGuest>
              <a routerLink="/login" (click)="mobileOpen = false" class="block px-4 py-3 text-sm t-text-secondary hover:t-text">Sign In</a>
              <a routerLink="/register" (click)="mobileOpen = false" class="block px-4 py-3 text-sm text-cyan-600">Sign Up</a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  mobileOpen = false;

  allLinks = [
    { to: '/', label: 'Home', icon: '🏠', auth: false },
    { to: '/apply', label: 'Apply', icon: '📝', auth: true },
    { to: '/compare', label: 'Compare', icon: '📊', auth: false },
    { to: '/profile', label: 'Profile', icon: '👤', auth: true },
  ];

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  get visibleLinks() {
    return this.allLinks.filter(l => !l.auth || this.auth.isLoggedIn());
  }

  handleLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.mobileOpen = false;
  }
}
