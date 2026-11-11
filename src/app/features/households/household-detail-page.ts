import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OSMStore } from '../../osm.store';
import { PreferencesStore } from '../../preferences.store';
import { ConfirmDialog, type ConfirmDialogData } from '../../shared/confirm-dialog';
import { NotFoundInline } from '../../shared/not-found-inline';

@Component({ standalone: true, imports: [RouterLink, NotFoundInline, ConfirmDialog], templateUrl: './household-detail-page.html' })
export class HouseholdDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(OSMStore);
  protected readonly preferences = inject(PreferencesStore);
  private readonly id = this.route.snapshot.paramMap.get('householdId');
  protected readonly justSaved = this.route.snapshot.queryParamMap.get('saved') === '1';
  protected readonly household = computed(() => this.store.household(this.id));
  protected readonly members = computed(() => this.id ? this.store.householdMembers(this.id) : []);
  protected readonly deleteDialog = signal<ConfirmDialogData | null>(null);
  private pendingId: string | null = null;

  protected askRemoveHouse(house: { id: string; houseNumber: string; householdCode: string }): void {
    const memberCount = this.members().length;
    this.pendingId = house.id;
    this.deleteDialog.set({
      title: 'ลบครัวเรือน',
      message: `ต้องการลบครัวเรือนบ้านเลขที่ ${house.houseNumber} หรือไม่?`,
      detail: memberCount > 0
        ? `การลบนี้จะลบข้อมูลบ้านและสมาชิกทั้ง ${memberCount} คนพร้อมกัน`
        : `รหัสประจำบ้าน ${house.householdCode}`,
      confirmLabel: 'ยืนยันการลบ',
      cancelLabel: 'ยกเลิก',
    });
  }

  protected async confirmDelete(): Promise<void> {
    const pending = this.pendingId;
    if (pending) {
      this.deleteDialog.set(null);
      this.pendingId = null;
      await this.store.removeHousehold(pending);
      if (this.store.household(pending)) return;
    }
    this.deleteDialog.set(null);
    this.pendingId = null;
    void this.router.navigate(['/households']);
  }

  protected cancelDelete(): void {
    this.deleteDialog.set(null);
    this.pendingId = null;
  }
}
