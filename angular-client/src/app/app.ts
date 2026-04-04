import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { FooterComponent } from './components/layout/footer.component';
import { ThemeService } from './services/theme.service';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class App implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }
}
