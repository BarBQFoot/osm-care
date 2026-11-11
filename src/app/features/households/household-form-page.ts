import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OSMStore } from '../../osm.store';

@Component({ standalone: true, imports: [ReactiveFormsModule, RouterLink], templateUrl: './household-form-page.html' })
export class HouseholdFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(OSMStore);
  protected readonly id = this.route.snapshot.paramMap.get('householdId');
  protected readonly editing = !!this.id;
  protected submitted = false;
  protected readonly saveFailed = signal(false);
  protected readonly form = this.fb.nonNullable.group({ houseNumber: ['', Validators.required], householdCode: ['', Validators.required] });
  private readonly formEl = viewChild.required<ElementRef<HTMLFormElement>>('formEl');

  private patched = false;

  constructor() {
    effect(() => {
      const household = this.store.household(this.id);
      if (household && !this.patched) { this.form.patchValue(household); this.patched = true; }
    });
  }
  protected showError(key: 'houseNumber' | 'householdCode'): boolean { const control = this.form.controls[key]; return control.invalid && (control.touched || this.submitted); }
  protected async save(): Promise<void> {
    this.submitted = true;
    this.saveFailed.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formEl().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
      return;
    }
    const id = await this.store.saveHousehold(this.form.getRawValue(), this.id ?? undefined);
    if (!id) { this.saveFailed.set(true); return; }
    void this.router.navigate(['/households', id], { queryParams: { saved: 1 } });
  }
}
