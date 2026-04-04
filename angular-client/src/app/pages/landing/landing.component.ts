import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <!-- Animated background grid -->
        <div class="absolute inset-0 hero-grid-bg pointer-events-none"></div>

        <!-- Animated gradient orbs -->
        <div class="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 dark:from-cyan-400/20 dark:to-blue-500/20 hero-orb pointer-events-none"></div>
        <div class="absolute bottom-10 right-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-400/30 to-pink-500/30 dark:from-purple-400/20 dark:to-pink-500/20 hero-orb-2 pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 hero-orb pointer-events-none" style="animation-delay: -4s"></div>

        <!-- Floating particles -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div *ngFor="let dot of floatingDots; let i = index"
               class="absolute rounded-full opacity-60 dark:opacity-40 hero-dot"
               [ngClass]="dot.color"
               [ngStyle]="{ top: dot.top, left: dot.left, width: dot.size + 'px', height: dot.size + 'px', animationDelay: dot.delay }">
          </div>
        </div>

        <!-- Animated accent lines -->
        <div class="absolute top-1/3 left-0 right-0 pointer-events-none">
          <div class="hero-line h-px bg-gradient-to-r from-transparent via-cyan-500/60 dark:via-cyan-500/40 to-transparent mb-20"></div>
          <div class="hero-line h-px bg-gradient-to-r from-transparent via-purple-500/50 dark:via-purple-500/30 to-transparent mb-16"></div>
          <div class="hero-line h-px bg-gradient-to-r from-transparent via-blue-500/40 dark:via-blue-500/20 to-transparent"></div>
        </div>

        <!-- Floating geometric shapes -->
        <div class="absolute top-[15%] right-[15%] hero-float pointer-events-none opacity-40 dark:opacity-20">
          <div class="w-16 h-16 border-2 border-cyan-500 dark:border-cyan-400 rounded-lg rotate-45"></div>
        </div>
        <div class="absolute bottom-[20%] left-[10%] hero-float-reverse pointer-events-none opacity-35 dark:opacity-15">
          <div class="w-12 h-12 border-2 border-purple-500 dark:border-purple-400 rounded-full"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center">
            <!-- Animated badge -->
            <div class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 border border-cyan-500/20 mb-8 backdrop-blur-sm">
              <div class="relative">
                <span class="w-2 h-2 rounded-full bg-cyan-500 block"></span>
                <span class="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <span class="text-cyan-600 dark:text-cyan-400 text-sm font-medium">AI-Powered Loan Prediction</span>
              <span class="text-cyan-500">⚡</span>
            </div>

            <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span class="hero-shimmer-text">Smart Loan</span>
              <br />
              <span class="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Approval Predictor
              </span>
            </h1>

            <div class="relative inline-block">
              <p class="text-lg lg:text-xl t-text-muted max-w-2xl mx-auto mb-10 relative z-10">
                Leverage advanced machine learning to instantly predict your loan approval chances.
                Powered by KNN and Random Forest algorithms with 94%+ AUC score.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <ng-container *ngIf="auth.isLoggedIn(); else guestButtons">
                <button (click)="router.navigate(['/apply'])"
                        class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                  Apply for Loan →
                </button>
              </ng-container>
              <ng-template #guestButtons>
                <button (click)="router.navigate(['/register'])"
                        class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                  Get Started →
                </button>
                <button (click)="router.navigate(['/login'])"
                        class="group inline-flex items-center gap-3 px-8 py-4 glass-card rounded-xl font-semibold t-text text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-cyan-500/30">
                  Sign In →
                </button>
              </ng-template>
            </div>
          </div>

          <!-- Stats bar -->
          <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div *ngFor="let stat of stats"
                 class="glass-card p-6 text-center rounded-xl group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
              <div class="relative z-10">
                <div class="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent hero-stat-enter"
                     [ngStyle]="{ animationDelay: stat.delay + 'ms' }">
                  {{ stat.value }}
                </div>
                <div class="t-text-muted text-sm mt-1">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold t-text mb-4">Why Choose LoanPredict AI?</h2>
            <p class="t-text-muted text-lg max-w-xl mx-auto">Built with state-of-the-art machine learning for reliable, explainable predictions.</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let feature of features"
                 class="glass-card p-6 rounded-xl group hover:-translate-y-1 transition-all duration-300">
              <div [class]="'w-12 h-12 rounded-lg bg-gradient-to-br ' + feature.gradient + ' flex items-center justify-center mb-4 shadow-lg'">
                <span class="text-white text-xl">{{ feature.icon }}</span>
              </div>
              <h3 class="t-text font-semibold text-lg mb-2">{{ feature.title }}</h3>
              <p class="t-text-muted text-sm leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold t-text mb-4">How It Works</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div *ngFor="let item of howItWorks" class="relative text-center group">
              <div [class]="'text-6xl font-bold bg-gradient-to-br ' + item.gradient + ' bg-clip-text text-transparent opacity-30 group-hover:opacity-50 transition-opacity mb-4'">
                {{ item.step }}
              </div>
              <h3 class="t-text font-semibold text-xl mb-2">{{ item.title }}</h3>
              <p class="t-text-muted">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20">
        <div class="max-w-3xl mx-auto px-4 text-center">
          <div class="relative glass-card p-12 rounded-2xl overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            <div class="relative z-10">
              <h2 class="text-3xl font-bold t-text mb-4">Ready to Check Your Eligibility?</h2>
              <p class="t-text-muted mb-8">Join thousands of users who trust our AI system to predict their loan approval chances.</p>
              <button (click)="router.navigate([auth.isLoggedIn() ? '/apply' : '/register'])"
                      class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300">
                {{ auth.isLoggedIn() ? 'Apply Now' : 'Get Started Free' }} →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-20">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl lg:text-4xl font-bold t-text mb-4">Frequently Asked Questions</h2>
            <p class="t-text-muted text-lg">Everything you need to know about our AI loan prediction system.</p>
          </div>
          <div class="space-y-3">
            <div *ngFor="let faq of faqData; let i = index" class="glass-card rounded-xl overflow-hidden">
              <button (click)="toggleFaq(i)" class="w-full flex items-center justify-between px-6 py-5 text-left">
                <span class="t-text font-medium pr-4">{{ faq.q }}</span>
                <span class="t-text-muted flex-shrink-0 transition-transform duration-300"
                      [class.rotate-180]="openFaq === i">▼</span>
              </button>
              <div class="overflow-hidden transition-all duration-300"
                   [class.max-h-96]="openFaq === i" [class.opacity-100]="openFaq === i"
                   [class.max-h-0]="openFaq !== i" [class.opacity-0]="openFaq !== i">
                <p class="px-6 pb-5 t-text-secondary text-sm leading-relaxed">{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class LandingPageComponent {
  openFaq: number | null = null;

  constructor(public auth: AuthService, public router: Router) {}

  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }

  floatingDots = [
    { top: '15%', left: '8%', size: 8, color: 'bg-cyan-500 dark:bg-cyan-400', delay: '0s' },
    { top: '25%', left: '85%', size: 6, color: 'bg-blue-500 dark:bg-blue-400', delay: '-2s' },
    { top: '60%', left: '12%', size: 7, color: 'bg-purple-500 dark:bg-purple-400', delay: '-4s' },
    { top: '70%', left: '78%', size: 5, color: 'bg-cyan-600 dark:bg-cyan-300', delay: '-1s' },
    { top: '40%', left: '92%', size: 9, color: 'bg-indigo-500 dark:bg-indigo-400', delay: '-3s' },
    { top: '80%', left: '45%', size: 6, color: 'bg-teal-500 dark:bg-teal-400', delay: '-5s' },
  ];

  stats = [
    { value: '87.9%', label: 'RF Accuracy', delay: 0 },
    { value: '94.1%', label: 'ROC-AUC', delay: 100 },
    { value: '< 3s', label: 'Prediction Time', delay: 200 },
    { value: '18', label: 'Features Analyzed', delay: 300 },
  ];

  features = [
    { icon: '🛡️', title: 'Dual-Model Analysis', desc: 'KNN & Random Forest models evaluate your application simultaneously for maximum accuracy.', gradient: 'from-cyan-500 to-teal-500' },
    { icon: '📈', title: '94%+ AUC Score', desc: 'Our Random Forest achieves 94% ROC-AUC with hyperparameter-tuned models on 5000+ samples.', gradient: 'from-blue-500 to-indigo-500' },
    { icon: '⏱️', title: 'Instant Results', desc: 'Get your loan approval prediction in seconds with detailed risk assessment and confidence scores.', gradient: 'from-purple-500 to-pink-500' },
    { icon: '📊', title: 'Deep Analytics', desc: 'View confidence scores, model comparison charts, feature importance, and risk flag breakdowns.', gradient: 'from-amber-500 to-orange-500' },
  ];

  howItWorks = [
    { step: '01', title: 'Create Account', desc: 'Sign up and complete your profile with personal details.', gradient: 'from-cyan-500 to-teal-500' },
    { step: '02', title: 'Submit Application', desc: 'Fill out the loan form and upload supporting documents.', gradient: 'from-blue-500 to-indigo-500' },
    { step: '03', title: 'View Results', desc: 'Get instant AI predictions with risk assessment and model comparison.', gradient: 'from-purple-500 to-pink-500' },
  ];

  faqData = [
    { q: 'How does AI predict my loan approval?', a: 'Our system uses two machine learning models — K-Nearest Neighbors (KNN) and Random Forest — trained on thousands of loan applications. They analyze 18 features including income, credit history, loan amount, EMI burden ratio, and more to predict whether a loan would be approved. Both models run simultaneously and their predictions are compared for reliability.' },
    { q: 'What factors affect my loan eligibility the most?', a: 'Credit history is the single strongest factor. After that, income-to-loan ratio, EMI burden (monthly payment vs income), employment status, and whether you have a co-applicant all play significant roles.' },
    { q: 'Is my data safe? Does this affect my credit score?', a: 'Your data is encrypted and never shared with third parties. This is a prediction tool — we do not perform hard credit inquiries. Checking your eligibility here has zero impact on your actual credit score.' },
    { q: 'What is the risk assessment system?', a: 'Beyond ML predictions, we run 9 automated risk checks — including application frequency limits, consecutive rejection cooldown, debt-to-income ratio, minimum income threshold, and more.' },
    { q: 'How accurate are the predictions?', a: 'Our Random Forest model achieves 87.9% accuracy and 94.1% ROC-AUC, while KNN achieves 85.5% accuracy and 91.9% AUC. These models are trained on realistic distributions with stratified cross-validation and hyperparameter tuning.' },
    { q: 'What types of loans are supported?', a: 'We support predictions for Home Loans, Personal Loans, Education Loans, Vehicle Loans, Business Loans, Gold Loans, and Agriculture Loans.' },
  ];
}
