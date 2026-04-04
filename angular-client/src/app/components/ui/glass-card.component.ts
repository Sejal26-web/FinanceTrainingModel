import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'glass-card rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-black/15 dark:hover:border-white/15 ' + extraClass">
      <ng-content></ng-content>
    </div>
  `
})
export class GlassCardComponent {
  @Input() extraClass = '';
}
