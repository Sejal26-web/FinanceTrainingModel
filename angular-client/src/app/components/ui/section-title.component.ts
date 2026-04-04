import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'mb-5 ' + extraClass">
      <h2 class="text-lg font-semibold t-text"><ng-content></ng-content></h2>
      <p *ngIf="subtitle" class="text-sm t-text-muted mt-0.5">{{ subtitle }}</p>
    </div>
  `
})
export class SectionTitleComponent {
  @Input() subtitle = '';
  @Input() extraClass = '';
}
