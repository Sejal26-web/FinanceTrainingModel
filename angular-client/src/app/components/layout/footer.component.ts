import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="text-center py-8 mt-12 border-t t-border">
      <p class="t-text-muted text-xs">
        Loan Approval Prediction System &mdash; KNN &amp; Random Forest Comparison
      </p>
    </footer>
  `
})
export class FooterComponent {}
