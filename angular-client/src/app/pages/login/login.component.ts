import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold t-text mb-2">Welcome Back</h1>
          <p class="t-text-muted">Sign in to access your loan predictions</p>
        </div>

        <div class="glass-card p-8 rounded-2xl border t-border shadow-sm">
          <div *ngIf="error" class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {{ error }}
          </div>

          <form (ngSubmit)="handleSubmit()" class="space-y-5">
            <div>
              <label class="block t-text-secondary text-sm font-medium mb-2">Email</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">✉️</span>
                <input type="email" [(ngModel)]="email" name="email" required
                       class="w-full pl-10 pr-4 py-3 t-bg-input border t-border rounded-xl t-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                       placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label class="block t-text-secondary text-sm font-medium mb-2">Password</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">🔒</span>
                <input type="password" [(ngModel)]="password" name="password" required minlength="6"
                       class="w-full pl-10 pr-4 py-3 t-bg-input border t-border rounded-xl t-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                       placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" [disabled]="loading"
                    class="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50">
              <span *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span *ngIf="!loading">Sign In →</span>
            </button>
          </form>

          <p class="text-center t-text-muted text-sm mt-6">
            Don't have an account?
            <a routerLink="/register" class="text-cyan-600 hover:text-cyan-700 font-medium"> Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async handleSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
