import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, CategoryScale, LinearScale, BarElement, ArcElement,
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { ApiService } from '../../services/api.service';
import { COLORS, getChartOptions } from '../../config/chart-config';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  template: `
    <div *ngIf="prediction" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <!-- Nav Row -->
      <div class="flex items-center justify-between">
        <button (click)="router.navigate(['/apply'])"
                class="flex items-center gap-2 px-4 py-2 rounded-lg t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          ← Back
        </button>
        <a routerLink="/profile"
           class="flex items-center gap-2 px-4 py-2 rounded-lg text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all">
          All Loans →
        </a>
      </div>

      <!-- Risk Assessment Alert -->
      <div *ngIf="riskAssessment?.flags?.length" [class]="riskAlertClass">
        <div class="flex items-center gap-3 mb-4">
          <div [class]="riskIconClass">🛡️</div>
          <div>
            <h3 class="font-semibold t-text flex items-center gap-2">
              Risk Assessment
              <span [class]="riskBadgeClass">{{ riskAssessment.riskLevel }} Risk — Score: {{ riskAssessment.riskScore }}/100</span>
            </h3>
            <p *ngIf="riskAssessment.autoRejected" class="text-red-600 text-sm font-medium mt-1">
              Application auto-rejected due to high risk score
            </p>
          </div>
        </div>
        <ul class="space-y-2">
          <li *ngFor="let flag of riskAssessment.flags" class="flex items-start gap-2 text-sm t-text-secondary">
            ⚠️ {{ flag }}
          </li>
        </ul>
      </div>

      <!-- Hero Verdict -->
      <div [class]="verdictClass">
        <div [class]="'absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full blur-3xl opacity-10 ' + verdictGlow"></div>
        <div class="relative z-10">
          <div [class]="verdictIconClass">
            <span class="text-4xl">{{ verdictIcon }}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold t-text mb-3">
            Loan <span [class]="verdictTextColor">{{ finalVerdict === 'Mixed' ? 'Under Review' : finalVerdict }}</span>
          </h1>
          <p class="t-text-muted text-lg max-w-lg mx-auto mb-8">
            {{ bothAgree
              ? 'Both KNN and Random Forest models agree on this prediction with high confidence.'
              : 'The two models produced different results. Review the detailed breakdown below.' }}
          </p>
          <!-- Confidence rings -->
          <div class="flex items-center justify-center gap-12 md:gap-20">
            <div class="flex flex-col items-center gap-2">
              <div class="relative" style="width: 120px; height: 120px">
                <svg width="120" height="120" class="-rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-color, rgba(0,0,0,0.05))" stroke-width="8" />
                  <circle cx="60" cy="60" r="52" fill="none" [attr.stroke]="isKnnApproved ? '#10b981' : '#f43f5e'" stroke-width="8" stroke-linecap="round"
                          [attr.stroke-dasharray]="knnCircumference" [attr.stroke-dashoffset]="knnOffset"
                          style="transition: stroke-dashoffset 1s ease-out" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold t-text">{{ knn.confidence }}%</span>
                </div>
              </div>
              <span class="t-text-muted text-sm">KNN Confidence</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <div class="relative" style="width: 120px; height: 120px">
                <svg width="120" height="120" class="-rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-color, rgba(0,0,0,0.05))" stroke-width="8" />
                  <circle cx="60" cy="60" r="52" fill="none" [attr.stroke]="isRfApproved ? '#10b981' : '#f43f5e'" stroke-width="8" stroke-linecap="round"
                          [attr.stroke-dasharray]="rfCircumference" [attr.stroke-dashoffset]="rfOffset"
                          style="transition: stroke-dashoffset 1s ease-out" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold t-text">{{ rf.confidence }}%</span>
                </div>
              </div>
              <span class="t-text-muted text-sm">RF Confidence</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Result Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        <div *ngFor="let m of modelCards" [class]="'glass-card rounded-2xl border overflow-hidden ' + (m.approved ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800')">
          <div [class]="'h-1 ' + (m.approved ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-rose-400')"></div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <div [class]="m.accent === 'cyan' ? 'w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/20' : 'w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20'">
                  📊
                </div>
                <h3 class="text-lg font-semibold t-text">{{ m.name }}</h3>
              </div>
              <span [class]="m.approved ? 'px-3 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'">
                {{ m.model.prediction }}
              </span>
            </div>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between text-sm mb-1.5">
                  <span class="t-text-muted">Approval Probability</span>
                  <span class="text-green-600 font-semibold">{{ m.model.probabilities.approved }}%</span>
                </div>
                <div class="h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                       [ngStyle]="{ width: m.model.probabilities.approved + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-sm mb-1.5">
                  <span class="t-text-muted">Rejection Probability</span>
                  <span class="text-red-600 font-semibold">{{ m.model.probabilities.rejected }}%</span>
                </div>
                <div class="h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-1000"
                       [ngStyle]="{ width: m.model.probabilities.rejected + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row 1: Confidence + Probability Donuts -->
      <div class="grid lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 glass-card p-6 rounded-2xl border t-border">
          <h3 class="text-base font-semibold t-text mb-1 flex items-center gap-2">📊 Confidence Comparison</h3>
          <p class="t-text-muted text-xs mb-4">How confident each model is in its prediction</p>
          <div style="height: 256px">
            <canvas baseChart [datasets]="confidenceData.datasets" [labels]="confidenceData.labels"
                    [options]="barOptionsNoLegend" type="bar"></canvas>
          </div>
        </div>
        <div class="lg:col-span-2 glass-card p-6 rounded-2xl border t-border">
          <h3 class="text-base font-semibold t-text mb-1">Probability Split</h3>
          <p class="t-text-muted text-xs mb-4">Approval vs rejection breakdown per model</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col items-center">
              <div style="height: 160px; width: 100%">
                <canvas baseChart [datasets]="knnDoughnutData.datasets" [labels]="knnDoughnutData.labels"
                        [options]="doughnutOptions" type="doughnut"></canvas>
              </div>
              <span class="t-text-muted text-xs mt-2 font-medium">KNN</span>
            </div>
            <div class="flex flex-col items-center">
              <div style="height: 160px; width: 100%">
                <canvas baseChart [datasets]="rfDoughnutData.datasets" [labels]="rfDoughnutData.labels"
                        [options]="doughnutOptions" type="doughnut"></canvas>
              </div>
              <span class="t-text-muted text-xs mt-2 font-medium">Random Forest</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Metrics Section -->
      <ng-container *ngIf="metrics">
        <div class="text-center pt-4">
          <h2 class="text-2xl font-bold t-text mb-1">Model Performance Metrics</h2>
          <p class="t-text-muted text-sm">Accuracy, precision, recall and more — KNN vs Random Forest</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div *ngFor="let m of metricsList"
               class="glass-card rounded-xl border t-border p-4 hover:border-cyan-400 transition-colors hover:shadow-sm">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-cyan-600 text-sm">{{ m.icon }}</span>
              <span class="t-text-muted text-xs font-medium">{{ m.label }}</span>
            </div>
            <div class="flex items-end justify-between">
              <div>
                <div class="text-xs t-text-muted mb-0.5">KNN</div>
                <div class="text-lg font-bold text-cyan-600">{{ m.knn }}%</div>
              </div>
              <div class="text-right">
                <div class="text-xs t-text-muted mb-0.5">RF</div>
                <div class="text-lg font-bold text-blue-600">{{ m.rf }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row 2: Radar + Feature Importance -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div *ngIf="radarData" class="glass-card p-6 rounded-2xl border t-border">
            <h3 class="text-base font-semibold t-text mb-1">Performance Radar</h3>
            <p class="t-text-muted text-xs mb-4">Multi-metric overlay comparing both models</p>
            <div style="height: 288px">
              <canvas baseChart [datasets]="radarData.datasets" [labels]="radarData.labels"
                      [options]="radarOptions" type="radar"></canvas>
            </div>
          </div>
          <div *ngIf="featureImportanceData" class="glass-card p-6 rounded-2xl border t-border">
            <h3 class="text-base font-semibold t-text mb-1">Feature Importance (RF)</h3>
            <p class="t-text-muted text-xs mb-4">Which factors most influence the Random Forest decision</p>
            <div style="height: 288px">
              <canvas baseChart [datasets]="featureImportanceData.datasets" [labels]="featureImportanceData.labels"
                      [options]="featureBarOptions" type="bar"></canvas>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4 pb-8">
        <button (click)="router.navigate(['/apply'])"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold t-text-secondary border t-border hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          ← New Application
        </button>
        <a routerLink="/compare"
           class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
          Full Model Comparison →
        </a>
      </div>
    </div>
  `
})
export class ResultsPageComponent implements OnInit {
  prediction: any = null;
  metrics: any = null;
  knn: any = {};
  rf: any = {};
  riskAssessment: any = null;

  isKnnApproved = false;
  isRfApproved = false;
  bothAgree = false;
  finalVerdict = '';

  knnCircumference = 2 * Math.PI * 52;
  rfCircumference = 2 * Math.PI * 52;
  knnOffset = 0;
  rfOffset = 0;

  modelCards: any[] = [];
  metricsList: any[] = [];

  // Chart data
  confidenceData: any = { labels: [], datasets: [] };
  knnDoughnutData: any = { labels: [], datasets: [] };
  rfDoughnutData: any = { labels: [], datasets: [] };
  radarData: any = null;
  featureImportanceData: any = null;

  barOptionsNoLegend: any = {};
  doughnutOptions: any = {};
  radarOptions: any = {};
  featureBarOptions: any = {};

  constructor(
    public router: Router,
    private api: ApiService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.prediction = nav?.extras?.state?.['prediction'];
  }

  ngOnInit() {
    if (!this.prediction) {
      this.prediction = history.state?.prediction;
    }
    if (!this.prediction) {
      this.router.navigate(['/apply']);
      return;
    }

    const { results, riskAssessment } = this.prediction;
    this.knn = results.knn;
    this.rf = results.rf;
    this.riskAssessment = riskAssessment;

    this.isKnnApproved = this.knn.prediction === 'Approved';
    this.isRfApproved = this.rf.prediction === 'Approved';
    this.bothAgree = this.knn.prediction === this.rf.prediction;
    this.finalVerdict = this.bothAgree ? this.knn.prediction : 'Mixed';

    this.knnOffset = this.knnCircumference - (this.knn.confidence / 100) * this.knnCircumference;
    this.rfOffset = this.rfCircumference - (this.rf.confidence / 100) * this.rfCircumference;

    this.modelCards = [
      { name: 'KNN Model', model: this.knn, approved: this.isKnnApproved, accent: 'cyan' },
      { name: 'Random Forest', model: this.rf, approved: this.isRfApproved, accent: 'blue' },
    ];

    this.buildChartData();

    this.api.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.buildMetricsData();
      },
      error: () => {}
    });
  }

  private buildChartData() {
    const barOpts = getChartOptions('bar');
    this.barOptionsNoLegend = { ...barOpts, plugins: { ...barOpts.plugins, legend: { display: false } } };
    this.doughnutOptions = getChartOptions('doughnut');

    this.confidenceData = {
      labels: ['KNN', 'Random Forest'],
      datasets: [{
        label: 'Confidence %',
        data: [this.knn.confidence, this.rf.confidence],
        backgroundColor: [COLORS.cyan.bg, COLORS.blue.bg],
        borderColor: [COLORS.cyan.border, COLORS.blue.border],
        borderWidth: 2, borderRadius: 8, barPercentage: 0.5,
      }],
    };

    this.knnDoughnutData = {
      labels: ['Approved', 'Rejected'],
      datasets: [{ data: [this.knn.probabilities.approved, this.knn.probabilities.rejected], backgroundColor: [COLORS.green.bg, COLORS.red.bg], borderColor: [COLORS.green.border, COLORS.red.border], borderWidth: 2 }],
    };

    this.rfDoughnutData = {
      labels: ['Approved', 'Rejected'],
      datasets: [{ data: [this.rf.probabilities.approved, this.rf.probabilities.rejected], backgroundColor: [COLORS.green.bg, COLORS.red.bg], borderColor: [COLORS.green.border, COLORS.red.border], borderWidth: 2 }],
    };
  }

  private buildMetricsData() {
    if (!this.metrics) return;
    this.radarOptions = getChartOptions('radar');

    this.metricsList = [
      { label: 'Accuracy', icon: '🎯', knn: this.metrics.knn.accuracy, rf: this.metrics.rf.accuracy },
      { label: 'Precision', icon: '📏', knn: this.metrics.knn.precision, rf: this.metrics.rf.precision },
      { label: 'Recall', icon: '📈', knn: this.metrics.knn.recall, rf: this.metrics.rf.recall },
      { label: 'F1 Score', icon: '🏆', knn: this.metrics.knn.f1_score, rf: this.metrics.rf.f1_score },
      { label: 'CV Mean', icon: '📚', knn: this.metrics.knn.cv_mean, rf: this.metrics.rf.cv_mean },
    ];

    this.radarData = {
      labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'CV Mean'],
      datasets: [
        { label: 'KNN', data: [this.metrics.knn.accuracy, this.metrics.knn.precision, this.metrics.knn.recall, this.metrics.knn.f1_score, this.metrics.knn.cv_mean], backgroundColor: COLORS.cyan.light, borderColor: COLORS.cyan.border, pointBackgroundColor: COLORS.cyan.border, pointRadius: 4, borderWidth: 2 },
        { label: 'Random Forest', data: [this.metrics.rf.accuracy, this.metrics.rf.precision, this.metrics.rf.recall, this.metrics.rf.f1_score, this.metrics.rf.cv_mean], backgroundColor: COLORS.blue.light, borderColor: COLORS.blue.border, pointBackgroundColor: COLORS.blue.border, pointRadius: 4, borderWidth: 2 },
      ],
    };

    if (this.metrics.rf?.feature_importance) {
      const keys = Object.keys(this.metrics.rf.feature_importance);
      const vals = Object.values(this.metrics.rf.feature_importance) as number[];
      const colorPalette = [COLORS.cyan.bg, COLORS.blue.bg, COLORS.purple.bg, COLORS.green.bg, COLORS.amber.bg, COLORS.red.bg, COLORS.pink.bg, COLORS.teal.bg, COLORS.orange.bg, COLORS.indigo.bg, COLORS.slate.bg];
      const borderPalette = [COLORS.cyan.border, COLORS.blue.border, COLORS.purple.border, COLORS.green.border, COLORS.amber.border, COLORS.red.border, COLORS.pink.border, COLORS.teal.border, COLORS.orange.border, COLORS.indigo.border, COLORS.slate.border];

      this.featureImportanceData = {
        labels: keys.map(k => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
        datasets: [{
          label: 'Importance',
          data: vals.map(v => +(v * 100).toFixed(1)),
          backgroundColor: keys.map((_, i) => colorPalette[i % 11]),
          borderColor: keys.map((_, i) => borderPalette[i % 11]),
          borderWidth: 1, borderRadius: 6,
        }],
      };

      const barOpts = getChartOptions('bar');
      this.featureBarOptions = {
        ...barOpts,
        indexAxis: 'y',
        scales: {
          ...barOpts.scales,
          y: { ...barOpts.scales.y, max: undefined, ticks: { ...barOpts.scales.y.ticks, font: { size: 10 } } },
          x: { ...barOpts.scales.x, ticks: { ...barOpts.scales.x.ticks, callback: (v: any) => v + '%' } },
        },
        plugins: { ...barOpts.plugins, legend: { display: false } },
      };
    }
  }

  get riskAlertClass() {
    if (!this.riskAssessment) return '';
    const level = this.riskAssessment.riskLevel;
    return 'rounded-2xl border p-6 ' + (level === 'High' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : level === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800');
  }

  get riskIconClass() {
    const level = this.riskAssessment?.riskLevel;
    return 'w-10 h-10 rounded-lg flex items-center justify-center ' + (level === 'High' ? 'bg-red-100 text-red-600' : level === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600');
  }

  get riskBadgeClass() {
    const level = this.riskAssessment?.riskLevel;
    return 'text-xs px-2 py-0.5 rounded-full font-medium ' + (level === 'High' ? 'bg-red-100 text-red-700' : level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700');
  }

  get verdictClass() {
    const base = 'relative overflow-hidden rounded-3xl border p-8 md:p-12 text-center ';
    if (this.finalVerdict === 'Approved') return base + 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-transparent dark:to-emerald-900/20';
    if (this.finalVerdict === 'Rejected') return base + 'border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-red-900/20 dark:via-transparent dark:to-rose-900/20';
    return base + 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-yellow-900/20 dark:via-transparent dark:to-amber-900/20';
  }

  get verdictGlow() {
    if (this.finalVerdict === 'Approved') return 'bg-green-400';
    if (this.finalVerdict === 'Rejected') return 'bg-red-400';
    return 'bg-yellow-400';
  }

  get verdictIconClass() {
    const base = 'inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ';
    if (this.finalVerdict === 'Approved') return base + 'bg-green-100 text-green-600';
    if (this.finalVerdict === 'Rejected') return base + 'bg-red-100 text-red-600';
    return base + 'bg-yellow-100 text-yellow-600';
  }

  get verdictIcon() {
    if (this.finalVerdict === 'Approved') return '✓';
    if (this.finalVerdict === 'Rejected') return '✕';
    return '📊';
  }

  get verdictTextColor() {
    if (this.finalVerdict === 'Approved') return 'text-green-600';
    if (this.finalVerdict === 'Rejected') return 'text-red-600';
    return 'text-yellow-600';
  }
}
