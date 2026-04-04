import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, CategoryScale, LinearScale, BarElement, ArcElement,
  RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend
} from 'chart.js';
import { ApiService } from '../../services/api.service';
import { GlassCardComponent } from '../../components/ui/glass-card.component';
import { SectionTitleComponent } from '../../components/ui/section-title.component';
import { MetricCardComponent } from '../../components/ui/metric-card.component';
import { SpinnerComponent } from '../../components/ui/spinner.component';
import { COLORS, FEATURE_PALETTE, getChartOptions } from '../../config/chart-config';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, GlassCardComponent, SectionTitleComponent, MetricCardComponent, SpinnerComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <app-spinner *ngIf="loading"></app-spinner>

      <div *ngIf="error" class="text-sm text-red-500 bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl text-center">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error && metrics" class="space-y-6">
        <!-- Metric summary cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <app-metric-card [value]="metrics.knn.accuracy + '%'" label="KNN Accuracy" iconText="📊" color="cyan"></app-metric-card>
          <app-metric-card [value]="metrics.rf.accuracy + '%'" label="RF Accuracy" iconText="📊" color="purple"></app-metric-card>
          <app-metric-card [value]="metrics.knn.cv_mean + '%'" label="KNN CV Mean" iconText="🔄" color="cyan"></app-metric-card>
          <app-metric-card [value]="metrics.rf.cv_mean + '%'" label="RF CV Mean" iconText="🔄" color="blue"></app-metric-card>
          <app-metric-card *ngIf="stats?.total > 0" [value]="stats.total + ''" label="Predictions" iconText="🖥️" color="purple"></app-metric-card>
          <app-metric-card *ngIf="stats?.total > 0" [value]="stats.agreement.rate + '%'" label="Agreement" iconText="✓" color="green"></app-metric-card>
        </div>

        <!-- Performance bar chart -->
        <app-glass-card>
          <app-section-title subtitle="Accuracy, Precision, Recall & F1 side by side">Performance Metrics Comparison</app-section-title>
          <div style="height: 320px">
            <canvas baseChart [datasets]="perfData.datasets" [labels]="perfData.labels" [options]="barOptions" type="bar"></canvas>
          </div>
        </app-glass-card>

        <!-- Radar + Feature importance -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-glass-card>
            <app-section-title subtitle="Multi-metric radar overlay">Radar Overview</app-section-title>
            <div style="height: 320px">
              <canvas baseChart [datasets]="radarData.datasets" [labels]="radarData.labels" [options]="radarOptions" type="radar"></canvas>
            </div>
          </app-glass-card>
          <app-glass-card>
            <app-section-title subtitle="Which features matter most to Random Forest">RF Feature Importance</app-section-title>
            <div style="height: 320px">
              <canvas baseChart [datasets]="featureData.datasets" [labels]="featureData.labels" [options]="featureDoughnutOpts" type="doughnut"></canvas>
            </div>
          </app-glass-card>
        </div>

        <!-- Cross-validation -->
        <app-glass-card>
          <app-section-title subtitle="Per-fold accuracy across 5-fold cross-validation">Cross-Validation Scores</app-section-title>
          <div style="height: 288px">
            <canvas baseChart [datasets]="cvData.datasets" [labels]="cvData.labels" [options]="barOptions" type="bar"></canvas>
          </div>
        </app-glass-card>

        <!-- Confusion matrices -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-glass-card>
            <app-section-title>KNN Confusion Matrix</app-section-title>
            <div *ngIf="metrics.knn.confusion_matrix" class="overflow-x-auto">
              <table class="w-full max-w-xs mx-auto text-sm">
                <thead>
                  <tr>
                    <th class="p-3"></th>
                    <th class="p-3 t-text-muted font-semibold text-xs uppercase tracking-wider">Pred Rejected</th>
                    <th class="p-3 t-text-muted font-semibold text-xs uppercase tracking-wider">Pred Approved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of metrics.knn.confusion_matrix; let i = index">
                    <td class="p-3 t-text-muted font-medium text-xs uppercase tracking-wider">Actual {{ cmLabels[i] }}</td>
                    <td *ngFor="let val of row; let j = index"
                        [class]="'p-3 text-center text-lg font-bold rounded-lg ' + (i === j ? 'text-green-600 bg-green-600/5' : 'text-red-500 bg-red-500/5')">
                      {{ val }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </app-glass-card>
          <app-glass-card>
            <app-section-title>RF Confusion Matrix</app-section-title>
            <div *ngIf="metrics.rf.confusion_matrix" class="overflow-x-auto">
              <table class="w-full max-w-xs mx-auto text-sm">
                <thead>
                  <tr>
                    <th class="p-3"></th>
                    <th class="p-3 t-text-muted font-semibold text-xs uppercase tracking-wider">Pred Rejected</th>
                    <th class="p-3 t-text-muted font-semibold text-xs uppercase tracking-wider">Pred Approved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of metrics.rf.confusion_matrix; let i = index">
                    <td class="p-3 t-text-muted font-medium text-xs uppercase tracking-wider">Actual {{ cmLabels[i] }}</td>
                    <td *ngFor="let val of row; let j = index"
                        [class]="'p-3 text-center text-lg font-bold rounded-lg ' + (i === j ? 'text-green-600 bg-green-600/5' : 'text-red-500 bg-red-500/5')">
                      {{ val }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </app-glass-card>
        </div>
      </div>
    </div>
  `
})
export class ComparePageComponent implements OnInit {
  metrics: any = null;
  stats: any = null;
  loading = true;
  error = '';
  cmLabels = ['Rejected', 'Approved'];

  perfData: any = { labels: [], datasets: [] };
  radarData: any = { labels: [], datasets: [] };
  cvData: any = { labels: [], datasets: [] };
  featureData: any = { labels: [], datasets: [] };

  barOptions: any = {};
  radarOptions: any = {};
  featureDoughnutOpts: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    Promise.all([
      this.api.getMetrics().toPromise(),
      this.api.getPredictionStats().toPromise(),
    ]).then(([mRes, sRes]) => {
      this.metrics = mRes;
      this.stats = sRes;
      this.buildCharts();
      this.loading = false;
    }).catch(() => {
      this.error = 'Failed to load metrics. Train models first.';
      this.loading = false;
    });
  }

  private buildCharts() {
    const { knn, rf } = this.metrics;
    this.barOptions = getChartOptions('bar');
    this.radarOptions = getChartOptions('radar');

    this.perfData = {
      labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
      datasets: [
        { label: 'KNN', data: [knn.accuracy, knn.precision, knn.recall, knn.f1_score], backgroundColor: COLORS.cyan.bg, borderColor: COLORS.cyan.border, borderWidth: 1, borderRadius: 8 },
        { label: 'Random Forest', data: [rf.accuracy, rf.precision, rf.recall, rf.f1_score], backgroundColor: COLORS.blue.bg, borderColor: COLORS.blue.border, borderWidth: 1, borderRadius: 8 },
      ],
    };

    this.radarData = {
      labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'CV Mean'],
      datasets: [
        { label: 'KNN', data: [knn.accuracy, knn.precision, knn.recall, knn.f1_score, knn.cv_mean], backgroundColor: COLORS.cyan.light, borderColor: COLORS.cyan.border, pointBackgroundColor: COLORS.cyan.border, borderWidth: 2 },
        { label: 'Random Forest', data: [rf.accuracy, rf.precision, rf.recall, rf.f1_score, rf.cv_mean], backgroundColor: COLORS.blue.light, borderColor: COLORS.blue.border, pointBackgroundColor: COLORS.blue.border, borderWidth: 2 },
      ],
    };

    this.cvData = {
      labels: ['Fold 1', 'Fold 2', 'Fold 3', 'Fold 4', 'Fold 5'],
      datasets: [
        { label: 'KNN', data: knn.cv_scores, backgroundColor: COLORS.cyan.bg, borderRadius: 6 },
        { label: 'Random Forest', data: rf.cv_scores, backgroundColor: COLORS.blue.bg, borderRadius: 6 },
      ],
    };

    const featureLabels = rf.feature_importance ? Object.keys(rf.feature_importance) : [];
    const featureValues = rf.feature_importance ? Object.values(rf.feature_importance) : [];
    this.featureData = {
      labels: featureLabels,
      datasets: [{
        data: featureValues,
        backgroundColor: FEATURE_PALETTE.slice(0, featureLabels.length).map(c => c + '99'),
        borderColor: FEATURE_PALETTE.slice(0, featureLabels.length),
        borderWidth: 1, spacing: 2,
      }],
    };

    const dOpts = getChartOptions('doughnut');
    this.featureDoughnutOpts = {
      ...dOpts,
      cutout: '55%',
      plugins: {
        ...dOpts.plugins,
        legend: { position: 'right', labels: { color: 'var(--text-muted)', padding: 8, font: { size: 10 }, boxWidth: 12, borderRadius: 2 } },
      },
    };
  }
}
