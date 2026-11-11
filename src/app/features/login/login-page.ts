import { Component, inject, signal } from '@angular/core';
import { AuthStore } from '../../auth.store';

@Component({ standalone: true, selector: 'app-login-page', templateUrl: './login-page.html' })
export class LoginPage {
  private readonly auth = inject(AuthStore);
  protected readonly code = signal('');
  protected checking = this.auth.checking;
  protected loginError = this.auth.loginError;

  protected setCode(value: string): void { this.code.set(value); }
  protected async submit(): Promise<void> {
    if (this.code().length === 0 || this.checking()) return;
    await this.auth.signIn(this.code());
    if (this.auth.loginError()) this.code.set('');
  }
}
