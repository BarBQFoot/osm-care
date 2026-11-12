import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OSMStore, compareHouseNumber } from '../../osm.store';
import { PreferencesStore } from '../../preferences.store';

@Component({ standalone: true, imports: [RouterLink], templateUrl: './print-page.html' })
export class PrintPage {
  protected readonly store = inject(OSMStore);
  protected readonly preferences = inject(PreferencesStore);
  protected readonly selected = signal('all');
  protected readonly printHouseholds = computed(() => {
    const list = this.selected() === 'all' ? this.store.households() : this.store.households().filter((house) => house.id === this.selected());
    return [...list].sort((a, b) => compareHouseNumber(a.houseNumber, b.houseNumber));
  });
  protected print(): void { window.print(); }
}
