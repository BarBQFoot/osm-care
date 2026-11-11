import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly user = signal<{ email: string } | null>(null);
  readonly ready = signal(false);
  readonly checking = signal(false);
  readonly loginError = signal('');

  constructor() {
    void supabase.auth.getSession().then(({ data }) => {
      this.user.set(data.session?.user ? { email: data.session.user.email ?? '' } : null);
      this.ready.set(true);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ? { email: session.user.email ?? '' } : null);
    });
  }

  async signIn(code: string): Promise<boolean> {
    this.checking.set(true);
    this.loginError.set('');
    const { error } = await supabase.auth.signInWithPassword({ email: environment.loginEmail, password: code });
    this.checking.set(false);
    if (error) { this.loginError.set('รหัสไม่ถูกต้อง ลองใหม่อีกครั้ง'); return false; }
    return true;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }
}
