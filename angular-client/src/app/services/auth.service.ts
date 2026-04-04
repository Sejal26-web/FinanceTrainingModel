import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<any>(null);
  private loadingSignal = signal(true);

  user = this.userSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userSignal());

  constructor(private api: ApiService) {
    this.initAuth();
  }

  private initAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.api.getProfile().subscribe({
        next: (res) => {
          this.userSignal.set(res.user);
          this.loadingSignal.set(false);
        },
        error: () => {
          localStorage.removeItem('token');
          this.loadingSignal.set(false);
        }
      });
    } else {
      this.loadingSignal.set(false);
    }
  }

  async login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.login({ email, password }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.userSignal.set(res.user);
          resolve(res);
        },
        error: (err) => reject(err)
      });
    });
  }

  async register(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.register(data).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.userSignal.set(res.user);
          resolve(res);
        },
        error: (err) => reject(err)
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.userSignal.set(null);
  }

  updateUser(user: any) {
    this.userSignal.set(user);
  }
}
