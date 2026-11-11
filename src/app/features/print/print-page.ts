import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OSMStore, type Household } from '../../osm.store';
import { PreferencesStore } from '../../preferences.store';

function houseRank(value: string): number[] {
  return value.split('/').map((part) => Number.parseInt(part, 10) || 0);
}

@Component({ standalone: true, imports: [RouterLink], templateUrl: './print-page.html' })
export class PrintPage {
  protected readonly store = inject(OSMStore);
  protected readonly preferences = inject(PreferencesStore);
  protected readonly selected = signal('all');
  protected readonly printHouseholds = computed(() => {
    const list = this.selected() === 'all' ? this.store.households() : this.store.households().filter((house) => house.id === this.selected());
    return [...list].sort((a: Household, b: Household) => {
      const pa = houseRank(a.houseNumber);
      const pb = houseRank(b.houseNumber);
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
        if (diff) return diff;
      }
      return a.houseNumber.localeCompare(b.houseNumber, 'th');
    });
  });
  protected print(): void { window.print(); }
  protected savePdf(): void { window.print(); }
}
