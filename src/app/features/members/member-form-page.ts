import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OSMStore } from '../../osm.store';
import { NotFoundInline } from '../../shared/not-found-inline';

@Component({ standalone: true, imports: [ReactiveFormsModule, RouterLink, NotFoundInline], templateUrl: './member-form-page.html' })
export class MemberFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(OSMStore);
  protected readonly householdId = this.route.snapshot.paramMap.get('householdId');
  protected readonly memberId = this.route.snapshot.paramMap.get('memberId');
  protected readonly editing = !!this.memberId;
  protected submitted = false;
  protected readonly saveFailed = signal(false);
  protected readonly saving = signal(false);
  protected readonly birthDateError = signal(false);
  protected readonly household = computed(() => this.store.household(this.householdId));
  protected readonly dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  protected readonly monthOptions = [
    { value: 1, label: 'ม.ค.' }, { value: 2, label: 'ก.พ.' }, { value: 3, label: 'มี.ค.' },
    { value: 4, label: 'เม.ย.' }, { value: 5, label: 'พ.ค.' }, { value: 6, label: 'มิ.ย.' },
    { value: 7, label: 'ก.ค.' }, { value: 8, label: 'ส.ค.' }, { value: 9, label: 'ก.ย.' },
    { value: 10, label: 'ต.ค.' }, { value: 11, label: 'พ.ย.' }, { value: 12, label: 'ธ.ค.' },
  ];
  protected readonly form = this.fb.nonNullable.group({
    title: [''], firstName: ['', Validators.required], lastName: ['', Validators.required],
    nationalId: [''], dateOfBirth: [''], gender: [''], relationship: [''], phone: [''],
    occupation: [''], note: [''], birthYearOnly: [false], birthYearBE: ['', [Validators.pattern(/^\d{4}$/)]],
    birthDay: [''], birthMonth: [''], birthYear: [''],
  });
  private readonly formEl = viewChild.required<ElementRef<HTMLFormElement>>('formEl');

  private patched = false;

  constructor() {
    effect(() => {
      const member = this.store.member(this.memberId);
      if (member && !this.patched) {
        this.form.patchValue(member);
        if (member.dateOfBirth) this.fillBirthDateParts(member.dateOfBirth);
        if (member.birthYearOnly && member.dateOfBirth) this.form.controls.birthYearBE.setValue(String(Number(member.dateOfBirth.slice(0, 4)) + 543));
        this.patched = true;
      }
    });
  }

  protected showError(key: 'firstName' | 'lastName' | 'birthYearBE'): boolean {
    const control = this.form.controls[key];
    return control.invalid && (control.touched || this.submitted);
  }

  private fillBirthDateParts(value: string): void {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return;
    this.form.controls.birthDay.setValue(String(day));
    this.form.controls.birthMonth.setValue(String(month));
    this.form.controls.birthYear.setValue(String(year + 543));
  }

  private composeBirthDate(): string | null {
    const day = Number(this.form.controls.birthDay.value);
    const month = Number(this.form.controls.birthMonth.value);
    const be = Number(this.form.controls.birthYear.value);
    if (!day && !month && !be) return '';
    if (!day || !month || !be || be < 2100 || be > 2600) return null;
    const year = be - 543;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  protected toggleYearOnly(): void {
    const on = !this.form.controls.birthYearOnly.value;
    this.form.controls.birthYearOnly.setValue(on);
    if (on) {
      const dob = this.composeBirthDate();
      if (dob) this.form.controls.birthYearBE.setValue(String(Number(dob.slice(0, 4)) + 543));
    } else {
      const be = Number(this.form.controls.birthYearBE.value);
      if (be >= 2100 && be <= 2600) {
        this.form.controls.birthDay.setValue('1');
        this.form.controls.birthMonth.setValue('1');
        this.form.controls.birthYear.setValue(String(be));
      }
    }
  }

  protected async save(): Promise<void> {
    if (this.saving()) return;
    this.submitted = true;
    this.saveFailed.set(false);
    this.birthDateError.set(false);
    this.form.controls.birthYearBE.markAsTouched();
    if (this.form.controls.birthYearOnly.value) {
      const be = Number(this.form.controls.birthYearBE.value);
      if (!/^\d{4}$/.test(this.form.controls.birthYearBE.value) || be < 2100 || be > 2600) return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formEl().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
      return;
    }
    if (!this.householdId) return;
    const value = this.form.getRawValue();
    if (value.birthYearOnly) {
      const be = Number(value.birthYearBE);
      value.dateOfBirth = `${be - 543}-01-01`;
    } else {
      const dob = this.composeBirthDate();
      if (dob === null) {
        this.birthDateError.set(true);
        this.formEl().nativeElement.querySelector<HTMLElement>('[formControlName="birthYear"]')?.focus();
        return;
      }
      value.dateOfBirth = dob;
    }
    const { birthYearBE: _b1, birthDay: _b2, birthMonth: _b3, birthYear: _b4, ...payload } = value;
    this.saving.set(true);
    try {
      const id = await this.store.saveMember({ ...payload, householdId: this.householdId }, this.memberId ?? undefined);
      if (!id) { this.saveFailed.set(true); return; }
      void this.router.navigate(['/households', this.householdId, 'members', id], { queryParams: { saved: 1 } });
    } catch {
      this.saveFailed.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
