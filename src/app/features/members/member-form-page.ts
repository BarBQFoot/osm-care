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
  protected readonly household = computed(() => this.store.household(this.householdId));
  protected readonly form = this.fb.nonNullable.group({
    title: [''], firstName: ['', Validators.required], lastName: ['', Validators.required],
    nationalId: [''], dateOfBirth: [''], gender: [''], relationship: [''], phone: [''],
    occupation: [''], note: [''], birthYearOnly: [false], birthYearBE: ['', [Validators.pattern(/^\d{4}$/)]],
  });
  private readonly formEl = viewChild.required<ElementRef<HTMLFormElement>>('formEl');

  private patched = false;

  constructor() {
    effect(() => {
      const member = this.store.member(this.memberId);
      if (member && !this.patched) {
        this.form.patchValue(member);
        if (member.birthYearOnly && member.dateOfBirth) this.form.controls.birthYearBE.setValue(String(Number(member.dateOfBirth.slice(0, 4)) + 543));
        this.patched = true;
      }
    });
  }

  protected showError(key: 'firstName' | 'lastName' | 'birthYearBE'): boolean {
    const control = this.form.controls[key];
    return control.invalid && (control.touched || this.submitted);
  }

  protected toggleYearOnly(): void {
    const on = !this.form.controls.birthYearOnly.value;
    this.form.controls.birthYearOnly.setValue(on);
    if (on) {
      const dob = this.form.controls.dateOfBirth.value;
      if (dob) this.form.controls.birthYearBE.setValue(String(Number(dob.slice(0, 4)) + 543));
    } else {
      const be = Number(this.form.controls.birthYearBE.value);
      if (be >= 2100 && be <= 2600) this.form.controls.dateOfBirth.setValue(`${be - 543}-01-01`);
    }
  }

  protected async save(): Promise<void> {
    this.submitted = true;
    this.saveFailed.set(false);
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
    }
    const { birthYearBE: _unused, ...payload } = value;
    const id = await this.store.saveMember({ ...payload, householdId: this.householdId }, this.memberId ?? undefined);
    if (!id) { this.saveFailed.set(true); return; }
    void this.router.navigate(['/households', this.householdId, 'members', id], { queryParams: { saved: 1 } });
  }
}
