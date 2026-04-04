import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

const VALID_LOAN_TERMS = [36, 60, 84, 120, 180, 240, 300, 360, 480];
const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business', 'Freelancer', 'Unemployed'];
const LOAN_TYPES = ['Home Loan', 'Personal Loan', 'Education Loan', 'Vehicle Loan', 'Business Loan', 'Gold Loan', 'Agriculture Loan'];

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold t-text mb-2">Loan Application</h1>
        <p class="t-text-muted">Fill in your details to get an AI-powered loan prediction</p>
      </div>

      <div *ngIf="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
        {{ error }}
      </div>

      <form (ngSubmit)="handleSubmit()" class="space-y-8">
        <!-- Personal Information -->
        <div class="glass-card p-6 rounded-2xl border t-border">
          <h2 class="text-xl font-semibold t-text mb-6 flex items-center gap-2">
            👤 Personal Information
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label [class]="labelClass">Full Name *</label>
              <input type="text" [(ngModel)]="applicantName" name="applicantName" required [class]="inputClass" placeholder="Your name" />
            </div>
            <div>
              <label [class]="labelClass">Age</label>
              <input type="number" [(ngModel)]="applicantAge" name="applicantAge" min="18" max="120" [class]="inputClass" placeholder="25" />
            </div>
            <div>
              <label [class]="labelClass">Employment Type *</label>
              <select [(ngModel)]="employmentType" name="employmentType" required [class]="selectClass">
                <option value="">Select</option>
                <option *ngFor="let t of employmentTypes" [value]="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Loan Type *</label>
              <select [(ngModel)]="loanType" name="loanType" required [class]="selectClass">
                <option value="">Select Loan Type</option>
                <option *ngFor="let t of loanTypes" [value]="t">{{ t }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loan Details -->
        <div class="glass-card p-6 rounded-2xl border t-border">
          <h2 class="text-xl font-semibold t-text mb-6 flex items-center gap-2">
            📝 Loan Details
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label [class]="labelClass">Gender</label>
              <select [(ngModel)]="form.gender" name="gender" [class]="selectClass">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Married</label>
              <select [(ngModel)]="form.married" name="married" [class]="selectClass">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Dependents</label>
              <input type="number" [(ngModel)]="form.dependents" name="dependents" min="0" max="10" [class]="inputClass" />
            </div>
            <div>
              <label [class]="labelClass">Education</label>
              <select [(ngModel)]="form.education" name="education" [class]="selectClass">
                <option value="Graduate">Graduate</option>
                <option value="Not Graduate">Not Graduate</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Self Employed</label>
              <select [(ngModel)]="form.self_employed" name="self_employed" [class]="selectClass">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Property Area</label>
              <select [(ngModel)]="form.property_area" name="property_area" [class]="selectClass">
                <option value="Urban">Urban</option>
                <option value="Semiurban">Semiurban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Applicant Income (₹)</label>
              <input type="number" [(ngModel)]="form.applicant_income" name="applicant_income" required min="0" [class]="inputClass" placeholder="50000" />
            </div>
            <div>
              <label [class]="labelClass">Co-applicant Income (₹)</label>
              <input type="number" [(ngModel)]="form.coapplicant_income" name="coapplicant_income" required min="0" [class]="inputClass" placeholder="0" />
            </div>
            <div>
              <label [class]="labelClass">Loan Amount (₹ thousands)</label>
              <input type="number" [(ngModel)]="form.loan_amount" name="loan_amount" required min="1" [class]="inputClass" placeholder="150" />
            </div>
            <div>
              <label [class]="labelClass">Loan Term (months)</label>
              <select [(ngModel)]="form.loan_amount_term" name="loan_amount_term" [class]="selectClass">
                <option *ngFor="let t of validLoanTerms" [value]="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label [class]="labelClass">Credit History</label>
              <select [(ngModel)]="form.credit_history" name="credit_history" [class]="selectClass">
                <option [ngValue]="1">Good (1)</option>
                <option [ngValue]="0">Bad (0)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Upload Support Documents -->
        <div class="glass-card p-6 rounded-2xl border t-border">
          <h2 class="text-xl font-semibold t-text mb-6 flex items-center gap-2">
            📎 Upload Support Documents
          </h2>
          <div class="border-2 border-dashed t-border rounded-xl p-8 text-center hover:border-cyan-500 transition-colors">
            <input type="file" id="fileUpload" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                   (change)="handleFileChange($event)" class="hidden" />
            <label for="fileUpload" class="cursor-pointer">
              <div class="text-3xl t-text-muted mx-auto mb-3">📤</div>
              <p class="t-text-secondary mb-1">Click to upload or drag and drop</p>
              <p class="t-text-muted text-sm">PDF, JPEG, PNG, DOC (max 5MB each, up to 5 files)</p>
            </label>
          </div>

          <div *ngIf="files.length > 0" class="mt-4 space-y-2">
            <div *ngFor="let file of files; let i = index"
                 class="flex items-center justify-between px-4 py-3 t-bg-input rounded-lg border t-border">
              <div class="flex items-center gap-3">
                <span class="text-cyan-600">📄</span>
                <span class="t-text-secondary text-sm truncate max-w-xs">{{ file.name }}</span>
                <span class="t-text-muted text-xs">({{ (file.size / 1024).toFixed(1) }} KB)</span>
              </div>
              <button type="button" (click)="removeFile(i)" class="text-red-500 hover:text-red-600 transition-colors">✕</button>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="text-center">
          <button type="submit" [disabled]="loading"
                  class="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50">
            <span *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span *ngIf="loading">Analyzing...</span>
            <span *ngIf="!loading">🚀 Submit Application</span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class LoanFormPageComponent {
  applicantName = '';
  applicantAge: any = '';
  employmentType = '';
  loanType = '';
  files: File[] = [];
  loading = false;
  error = '';

  form: any = {
    gender: 'Male',
    married: 'No',
    dependents: 0,
    education: 'Graduate',
    self_employed: 'No',
    applicant_income: '',
    coapplicant_income: '',
    loan_amount: '',
    loan_amount_term: 360,
    credit_history: 1,
    property_area: 'Urban',
  };

  validLoanTerms = VALID_LOAN_TERMS;
  employmentTypes = EMPLOYMENT_TYPES;
  loanTypes = LOAN_TYPES;

  inputClass = 'w-full px-4 py-3 t-bg-input border t-border rounded-xl t-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors';
  selectClass = 'w-full px-4 py-3 t-bg-input border t-border rounded-xl t-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors appearance-none';
  labelClass = 'block t-text-secondary text-sm font-medium mb-2';

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {
    const user = this.auth.user();
    if (user) {
      this.applicantName = user.name || '';
      this.applicantAge = user.age || '';
      this.employmentType = user.employmentType || '';
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.files = [...this.files, ...newFiles].slice(0, 5);
    }
  }

  removeFile(index: number) {
    this.files = this.files.filter((_, i) => i !== index);
  }

  handleSubmit() {
    this.error = '';
    this.loading = true;

    const formData = new FormData();
    formData.append('applicantName', this.applicantName);
    if (this.applicantAge) formData.append('applicantAge', this.applicantAge);
    formData.append('employmentType', this.employmentType);
    if (this.loanType) formData.append('loanType', this.loanType);

    Object.entries(this.form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    this.files.forEach((file) => {
      formData.append('supportDocs', file);
    });

    this.api.submitPrediction(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/results'], { state: { prediction: res } });
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Prediction failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
