import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'flex items-center justify-center py-12 ' + extraClass">
      <div [class]="sizeClass + ' border-2 border-black/10 dark:border-white/10 border-t-indigo-600 rounded-full animate-spin'"></div>
    </div>
  `
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() extraClass = '';

  get sizeClass() {
    const map = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return map[this.size];
  }
}
