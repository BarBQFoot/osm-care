import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OSMStore } from '../../osm.store';
import { PreferencesStore } from '../../preferences.store';
import { ConfirmDialog, type ConfirmDialogData } from '../../shared/confirm-dialog';
import { NotFoundInline } from '../../shared/not-found-inline';

@Component({ standalone: true, imports: [RouterLink, NotFoundInline, ConfirmDialog], templateUrl: './member-detail-page.html' })
export class MemberDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(OSMStore);
  protected readonly preferences = inject(PreferencesStore);
  private readonly id = this.route.snapshot.paramMap.get('memberId');
  protected readonly justSaved = this.route.snapshot.queryParamMap.get('saved') === '1';
  protected readonly member = computed(() => this.store.member(this.id));
  protected readonly household = computed(() => this.member() ? this.store.household(this.member()!.householdId) : undefined);
  protected readonly deleteDialog = signal<ConfirmDialogData | null>(null);
  private pendingId: string | null = null;

  protected askRemove(person: { id: string; title: string; firstName: string; lastName: string; householdId: string }): void {
    this.pendingId = person.id;
    this.deleteDialog.set({
      title: 'ลบสมาชิก',
      message: `ต้องการลบข้อมูลสมาชิก ${person.title}${person.firstName} ${person.lastName} หรือไม่?`,
      detail: 'ข้อมูลบุคคลของสมาชิกนี้จะถูกลบออกจากครัวเรือน',
      confirmLabel: 'ยืนยันการลบ',
      cancelLabel: 'ยกเลิก',
    });
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.member();
    const pending = this.pendingId;
    this.deleteDialog.set(null);
    this.pendingId = null;
    if (pending) {
      await this.store.removeMember(pending);
      if (this.store.member(pending)) return;
    }
    if (target && !this.store.member(pending ?? target.id)) void this.router.navigate(['/households', target.householdId]);
    else void this.router.navigate(['/households']);
  }

  protected cancelDelete(): void {
    this.deleteDialog.set(null);
    this.pendingId = null;
  }
}
