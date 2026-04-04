import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card rounded-xl p-5 text-center group transition-all duration-300 hover:-translate-y-0.5">
      <div [class]="colorClass + ' mb-2 flex justify-center text-xl'">{{ iconText }}</div>
      <div [class]="'text-2xl font-bold ' + colorClass">{{ value }}</div>
      <div class="text-xs t-text-muted uppercase tracking-wider mt-1 font-medium">{{ label }}</div>
    </div>
  `
})
export class MetricCardComponent {
  @Input() value = '';
  @Input() label = '';
  @Input() iconText = '📊';
  @Input() color = 'cyan';

  get colorClass() {
    const map: Record<string, string> = {
      cyan: 'text-cyan-600',
      blue: 'text-indigo-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      red: 'text-red-500',
      gold: 'text-amber-600',
    };
    return map[this.color] || map['cyan'];
  }
}
