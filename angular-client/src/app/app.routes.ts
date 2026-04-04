import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingPageComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginPageComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterPageComponent) },
  { path: 'compare', loadComponent: () => import('./pages/compare/compare.component').then(m => m.ComparePageComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfilePageComponent), canActivate: [authGuard] },
  { path: 'apply', loadComponent: () => import('./pages/loan-form/loan-form.component').then(m => m.LoanFormPageComponent), canActivate: [authGuard] },
  { path: 'results', loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsPageComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
