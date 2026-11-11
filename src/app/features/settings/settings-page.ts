import { Component, inject } from '@angular/core';
import { AuthStore } from '../../auth.store';
import { PreferencesStore } from '../../preferences.store';

@Component({ standalone: true, templateUrl: './settings-page.html' })
export class SettingsPage {
  private readonly auth = inject(AuthStore);
  protected readonly preferences = inject(PreferencesStore);

  protected logout(): void { void this.auth.signOut(); }
}
