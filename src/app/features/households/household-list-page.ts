import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OSMStore } from '../../osm.store';

@Component({ standalone: true, imports: [RouterLink], templateUrl: './household-list-page.html' })
export class HouseholdListPage {
  protected readonly store = inject(OSMStore);
  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.store.households().filter((house) => !query || `${house.houseNumber} ${house.householdCode}`.toLowerCase().includes(query));
  });
}
