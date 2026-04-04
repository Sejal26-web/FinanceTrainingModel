import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business', 'Freelancer', 'Unemployed'];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold t-text mb-2">Create Account</h1>
          <p class="t-text-muted">Join us to predict your loan approval</p>
        </div>

        <div class="glass-card p-8 rounded-2xl border t-border shadow-sm">
          <div *ngIf="error" class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {{ error }}
          </div>

          <form (ngSubmit)="handleSubmit()" class="space-y-5">
            <div>
              <label class="block t-text-secondary text-sm font-medium mb-2">Full Name</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">👤</span>
                <input type="text" [(ngModel)]="form.name" name="name" required [class]="inputClass" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label class="block t-text-secondary text-sm font-medium mb-2">Email</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">✉️</span>
                <input type="email" [(ngModel)]="form.email" name="email" required [class]="inputClass" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label class="block t-text-secondary text-sm font-medium mb-2">Password</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">🔒</span>
                <input type="password" [(ngModel)]="form.password" name="password" required minlength="6" [class]="inputClass" placeholder="Min 6 characters" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block t-text-secondary text-sm font-medium mb-2">Age</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">📅</span>
                  <input type="number" [(ngModel)]="form.age" name="age" min="18" max="120" [class]="inputClass" placeholder="25" />
                </div>
              </div>
              <div>
                <label class="block t-text-secondary text-sm font-medium mb-2">Employment</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted">💼</span>
                  <select [(ngModel)]="form.employmentType" name="employmentType" [class]="inputClass + ' appearance-none'">
                    <option value="">Select</option>
                    <option *ngFor="let t of employmentTypes" [value]="t">{{ t }}</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" [disabled]="loading"
                    class="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50">
              <span *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span *ngIf="!loading">Create Account →</span>
            </button>
          </form>

          <p class="text-center t-text-muted text-sm mt-6">
            Already have an account?
            <a routerLink="/login" class="text-cyan-600 hover:text-cyan-700 font-medium"> Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterPageComponent {
  form = { name: '', email: '', password: '', age: '', employmentType: '' };
  error = '';
  loading = false;
  employmentTypes = EMPLOYMENT_TYPES;
  inputClass = 'w-full pl-10 pr-4 py-3 t-bg-input border t-border rounded-xl t-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors';

  constructor(private auth: AuthService, private router: Router) {}

  async handleSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.auth.register({
        ...this.form,
        age: this.form.age ? Number(this.form.age) : undefined,
      });
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
