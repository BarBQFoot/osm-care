import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OSMStore } from '../../osm.store';
import { PreferencesStore } from '../../preferences.store';

@Component({ standalone: true, imports: [RouterLink], templateUrl: './dashboard-page.html' })
export class DashboardPage {
  protected readonly store = inject(OSMStore);
  protected readonly preferences = inject(PreferencesStore);
}
