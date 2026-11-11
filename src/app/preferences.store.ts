import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreferencesStore {
  readonly displayName = signal('นางบุญถม สุวรรณวงษ์');
  readonly buddhistYear = signal(true);
  readonly villageNo = signal('3');
  readonly subDistrict = signal('รัตนวาปี');
  readonly district = signal('รัตนวาปี');
  readonly province = signal('หนองคาย');
  readonly censusYear = signal(new Date().getFullYear() + 543);

  setDisplayName(value: string): void { this.displayName.set(value); }
  setVillageNo(value: string): void { this.villageNo.set(value); }
  setSubDistrict(value: string): void { this.subDistrict.set(value); }
  setDistrict(value: string): void { this.district.set(value); }
  setProvince(value: string): void { this.province.set(value); }
  setCensusYear(value: string): void { this.censusYear.set(Number(value) || new Date().getFullYear() + 543); }

  formatDate(value: string | Date): string {
    const locale = this.buddhistYear() ? 'th-TH-u-ca-buddhist' : 'th-TH-u-ca-gregory';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
  }

  formatToday(): string { return this.formatDate(new Date()); }

  formatShortThaiDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear() + 543}`;
  }

  birthDisplay(value: string, yearOnly: boolean): string {
    if (!value) return '—';
    if (yearOnly) return 'พ.ศ. ' + (Number(value.slice(0, 4)) + 543);
    return this.formatShortThaiDate(value);
  }

  ageOnToday(value: string): string {
    if (!value) return '';
    const birth = new Date(value);
    if (Number.isNaN(birth.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const beforeBirthday = today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
    if (beforeBirthday) age -= 1;
    return String(Math.max(age, 0));
  }
}
