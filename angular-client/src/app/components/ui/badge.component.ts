import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass">
      <span [class]="'w-1.5 h-1.5 rounded-full ' + (isApproved ? 'bg-green-600' : 'bg-red-500')"></span>
      {{ status }}
    </span>
  `
})
export class BadgeComponent {
  @Input() status = '';
  @Input() extraClass = '';

  get isApproved() {
    return this.status === 'Approved';
  }

  get badgeClass() {
    return `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
      this.isApproved
        ? 'bg-green-600/15 text-green-600 border border-green-600/25'
        : 'bg-red-500/15 text-red-500 border border-red-500/25'
    } ${this.extraClass}`;
  }
}
