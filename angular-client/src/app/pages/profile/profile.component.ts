import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { BadgeComponent } from '../../components/ui/badge.component';

const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business', 'Freelancer', 'Unemployed'];

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BadgeComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Card -->
      <div class="glass-card p-8 rounded-2xl border t-border mb-8 shadow-sm">
        <div class="flex items-start justify-between mb-6">
          <h2 class="text-2xl font-bold t-text">User Profile</h2>
          <button *ngIf="!editing" (click)="editing = true"
                  class="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors">
            ✏️ Edit
          </button>
          <div *ngIf="editing" class="flex gap-2">
            <button (click)="handleSave()" [disabled]="saving"
                    class="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              ✓ Save
            </button>
            <button (click)="cancelEdit()"
                    class="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              ✕ Cancel
            </button>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {{ auth.user()?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div>
              <input *ngIf="editing" [(ngModel)]="form.name"
                     class="t-bg-input border t-border rounded-lg px-3 py-2 t-text focus:border-blue-500 focus:outline-none" />
              <h3 *ngIf="!editing" class="text-xl font-semibold t-text">{{ auth.user()?.name }}</h3>
              <p class="t-text-muted flex items-center gap-1 mt-1">
                ✉️ {{ auth.user()?.email }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="glass-card p-4 rounded-xl border t-border">
              <div class="flex items-center gap-2 t-text-muted text-sm mb-1">📅 Age</div>
              <input *ngIf="editing" type="number" [(ngModel)]="form.age" min="18" max="120"
                     class="t-bg-input border t-border rounded-lg px-3 py-1 t-text w-full focus:border-blue-500 focus:outline-none" />
              <div *ngIf="!editing" class="t-text font-semibold text-lg">{{ auth.user()?.age || '—' }}</div>
            </div>
            <div class="glass-card p-4 rounded-xl border t-border">
              <div class="flex items-center gap-2 t-text-muted text-sm mb-1">💼 Employment</div>
              <select *ngIf="editing" [(ngModel)]="form.employmentType"
                      class="t-bg-input border t-border rounded-lg px-3 py-1 t-text w-full focus:border-blue-500 focus:outline-none appearance-none">
                <option value="">Select</option>
                <option *ngFor="let t of employmentTypes" [value]="t">{{ t }}</option>
              </select>
              <div *ngIf="!editing" class="t-text font-semibold text-lg">{{ auth.user()?.employmentType || '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <button (click)="router.navigate(['/apply'])"
                class="glass-card p-6 rounded-xl border t-border hover:border-cyan-400 transition-all group text-left hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="t-text font-semibold text-lg mb-1">Apply for New Loan</h3>
              <p class="t-text-muted text-sm">Submit a new loan application for AI prediction</p>
            </div>
            <span class="text-cyan-600 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
        <button (click)="router.navigate(['/compare'])"
                class="glass-card p-6 rounded-xl border t-border hover:border-cyan-400 transition-all group text-left hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="t-text font-semibold text-lg mb-1">Model Comparison</h3>
              <p class="t-text-muted text-sm">View KNN vs Random Forest performance metrics</p>
            </div>
            <span class="text-cyan-600 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>

      <!-- Past Applied Loans -->
      <div class="glass-card p-8 rounded-2xl border t-border shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold t-text flex items-center gap-3">📋 Past Applied Loans</h2>
          <span class="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-sm font-medium">
            {{ loans.length }} Applications
          </span>
        </div>

        <div *ngIf="loadingLoans" class="text-center py-12">
          <span class="w-8 h-8 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin inline-block"></span>
        </div>

        <div *ngIf="!loadingLoans && loans.length === 0" class="text-center py-12">
          <p class="t-text-muted mb-4">No loan applications yet</p>
          <a routerLink="/apply"
             class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
            Apply Now →
          </a>
        </div>

        <div *ngIf="!loadingLoans && loans.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b t-border">
                <th class="text-left py-3 px-4 t-text-muted font-medium">Date</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">Loan Type</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">Loan Amount</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">Income</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">Credit</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">KNN</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">RF</th>
                <th class="text-left py-3 px-4 t-text-muted font-medium">Docs</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loan of loans" class="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <td class="py-3 px-4 t-text-secondary">{{ loan.createdAt | date:'shortDate' }}</td>
                <td class="py-3 px-4 t-text-secondary">{{ loan.loanType || '—' }}</td>
                <td class="py-3 px-4 t-text font-medium">₹{{ loan.input?.loan_amount?.toLocaleString() }}</td>
                <td class="py-3 px-4 t-text-secondary">₹{{ loan.input?.applicant_income?.toLocaleString() }}</td>
                <td class="py-3 px-4 t-text-secondary">{{ loan.input?.credit_history ? 'Good' : 'Bad' }}</td>
                <td class="py-3 px-4"><app-badge [status]="loan.results?.knn?.prediction"></app-badge></td>
                <td class="py-3 px-4"><app-badge [status]="loan.results?.rf?.prediction"></app-badge></td>
                <td class="py-3 px-4 t-text-muted">{{ loan.supportDocs?.length || 0 }} files</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProfilePageComponent implements OnInit {
  editing = false;
  saving = false;
  loadingLoans = true;
  form = { name: '', age: '', employmentType: '' };
  loans: any[] = [];
  employmentTypes = EMPLOYMENT_TYPES;

  constructor(
    public auth: AuthService,
    private api: ApiService,
    public router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.form = {
        name: user.name || '',
        age: user.age || '',
        employmentType: user.employmentType || '',
      };
    }
    this.api.getMyPredictions().subscribe({
      next: (data) => { this.loans = data; this.loadingLoans = false; },
      error: () => { this.loadingLoans = false; }
    });
  }

  handleSave() {
    this.saving = true;
    this.api.updateProfile({
      name: this.form.name,
      age: this.form.age ? Number(this.form.age) : undefined,
      employmentType: this.form.employmentType,
    }).subscribe({
      next: (res) => {
        this.auth.updateUser(res.user);
        this.editing = false;
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  cancelEdit() {
    const user = this.auth.user();
    this.form = {
      name: user?.name || '',
      age: user?.age || '',
      employmentType: user?.employmentType || '',
    };
    this.editing = false;
  }
}
