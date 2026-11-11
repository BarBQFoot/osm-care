import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';

export interface Household {
  id: string;
  houseNumber: string;
  householdCode: string;
}

export interface Member {
  id: string;
  householdId: string;
  title: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  relationship: string;
  phone: string;
  occupation: string;
  note: string;
}

interface HouseholdRow { id: string; house_number: string; household_code: string; }
interface MemberRow {
  id: string; household_id: string; title: string; first_name: string; last_name: string;
  national_id: string; date_of_birth: string | null; gender: string; relationship: string;
  phone: string; occupation: string; note: string;
}

const SEED_HOUSES: { houseNumber: string; householdCode: string }[] = [
  { houseNumber: '12/1', householdCode: 'ชุมชน-001' },
  { houseNumber: '14', householdCode: 'ชุมชน-002' },
  { houseNumber: '18/2', householdCode: 'ชุมชน-003' },
  { houseNumber: '21', householdCode: 'ชุมชน-004' },
  { houseNumber: '25/1', householdCode: 'ชุมชน-005' },
  { houseNumber: '30', householdCode: 'ชุมชน-006' },
  { houseNumber: '32/3', householdCode: 'ชุมชน-007' },
  { houseNumber: '41', householdCode: 'ชุมชน-008' },
  { houseNumber: '44/1', householdCode: 'ชุมชน-009' },
  { houseNumber: '52', householdCode: 'ชุมชน-010' },
];

@Injectable({ providedIn: 'root' })
export class OSMStore {
  private readonly client = supabase;
  readonly households = signal<Household[]>([]);
  readonly members = signal<Member[]>([]);
  readonly ready = signal(false);
  readonly loadError = signal('');

  constructor() {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' && !this.ready()) void this.load();
      if (event === 'SIGNED_OUT') {
        this.households.set([]);
        this.members.set([]);
        this.ready.set(false);
        this.loadError.set('');
      }
    });
  }

  private toHousehold(row: HouseholdRow): Household {
    return { id: row.id, houseNumber: row.house_number, householdCode: row.household_code };
  }
  private toMember(row: MemberRow): Member {
    return {
      id: row.id, householdId: row.household_id, title: row.title ?? '',
      firstName: row.first_name, lastName: row.last_name, nationalId: row.national_id ?? '',
      dateOfBirth: row.date_of_birth ?? '', gender: row.gender ?? '', relationship: row.relationship ?? '',
      phone: row.phone ?? '', occupation: row.occupation ?? '', note: row.note ?? '',
    };
  }
  private toHouseRow(value: { houseNumber: string; householdCode: string }) {
    return { house_number: value.houseNumber, household_code: value.householdCode };
  }
  private toMemberRow(value: Omit<Member, 'id'>) {
    return {
      household_id: value.householdId, title: value.title, first_name: value.firstName,
      last_name: value.lastName, national_id: value.nationalId,
      date_of_birth: value.dateOfBirth || null, gender: value.gender, relationship: value.relationship,
      phone: value.phone, occupation: value.occupation, note: value.note,
    };
  }

  async load(): Promise<void> {
    this.loadError.set('');
    let houses = await this.fetchHouseholds();
    if (houses && houses.length === 0) {
      houses = await this.seed();
    }
    if (!houses) return;
    this.households.set(houses);
    const { data, error } = await this.client.from('members').select('*');
    if (error) { this.fail('โหลดรายชื่อสมาชิกไม่สำเร็จ', error.message); return; }
    this.members.set((data as MemberRow[]).map((row) => this.toMember(row)));
    this.ready.set(true);
  }

  private async fetchHouseholds(): Promise<Household[] | null> {
    const { data, error } = await this.client.from('households').select('*').order('house_number');
    if (error) { this.fail('โหลดรายการครัวเรือนไม่สำเร็จ', error.message); return null; }
    return (data as HouseholdRow[]).map((row) => this.toHousehold(row));
  }

  private fail(message: string, detail: string): void {
    console.error(message, detail);
    this.loadError.set(message + ' — ลองรีเฟรชหน้าใหม่');
  }

  private async seed(): Promise<Household[] | null> {
    const { data, error } = await this.client.from('households').insert(SEED_HOUSES.map((h) => this.toHouseRow(h))).select();
    if (error) { this.fail('สร้างข้อมูลตั้งต้นไม่สำเร็จ', error.message); return null; }
    const rows = data as HouseholdRow[];
    const seedMembers: { houseKey: string; member: Omit<Member, 'id' | 'householdId'> }[] = [
      { houseKey: 'ชุมชน-001', member: { title: 'นาง', firstName: 'สมใจ', lastName: 'ใจดี', nationalId: '', dateOfBirth: '1965-06-14', gender: 'หญิง', relationship: 'เจ้าบ้าน', phone: '08X-XXX-1201', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-001', member: { title: 'นาย', firstName: 'สมชาย', lastName: 'ใจดี', nationalId: '', dateOfBirth: '1962-02-20', gender: 'ชาย', relationship: 'คู่สมรส', phone: '', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-002', member: { title: 'นางสาว', firstName: 'มาลี', lastName: 'แสงทอง', nationalId: '', dateOfBirth: '1988-11-03', gender: 'หญิง', relationship: 'เจ้าบ้าน', phone: '08X-XXX-2402', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-003', member: { title: 'นาย', firstName: 'ประเสริฐ', lastName: 'มั่นคง', nationalId: '', dateOfBirth: '1954-08-29', gender: 'ชาย', relationship: 'เจ้าบ้าน', phone: '', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-004', member: { title: 'นาง', firstName: 'ดวงใจ', lastName: 'พูนสุข', nationalId: '', dateOfBirth: '1971-03-12', gender: 'หญิง', relationship: 'เจ้าบ้าน', phone: '08X-XXX-4204', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-004', member: { title: 'เด็กชาย', firstName: 'ต้นกล้า', lastName: 'พูนสุข', nationalId: '', dateOfBirth: '2012-09-10', gender: 'ชาย', relationship: 'บุตร', phone: '', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-005', member: { title: 'นาย', firstName: 'วิชัย', lastName: 'คำแสน', nationalId: '', dateOfBirth: '1980-01-26', gender: 'ชาย', relationship: 'เจ้าบ้าน', phone: '', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-006', member: { title: 'นาง', firstName: 'อารีย์', lastName: 'สุขใจ', nationalId: '', dateOfBirth: '1959-05-08', gender: 'หญิง', relationship: 'เจ้าบ้าน', phone: '08X-XXX-6606', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-007', member: { title: 'นาย', firstName: 'ธนา', lastName: 'บุญมี', nationalId: '', dateOfBirth: '1992-07-17', gender: 'ชาย', relationship: 'เจ้าบ้าน', phone: '', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-008', member: { title: 'นางสาว', firstName: 'พิมพ์ใจ', lastName: 'วงศ์คำ', nationalId: '', dateOfBirth: '1985-12-01', gender: 'หญิง', relationship: 'เจ้าบ้าน', phone: '08X-XXX-8808', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-009', member: { title: 'นาย', firstName: 'บุญส่ง', lastName: 'มีสุข', nationalId: '', dateOfBirth: '1948-04-21', gender: 'ชาย', relationship: 'เจ้าบ้าน', phone: '', occupation: '', note: '' } },
      { houseKey: 'ชุมชน-010', member: { title: 'นาง', firstName: 'สายฝน', lastName: 'แสนดี', nationalId: '', dateOfBirth: '1978-10-09', gender: 'หญิง', relationship: 'เจ้าบ้าน', phone: '08X-XXX-1010', occupation: '', note: '' } },
    ];
    const memberRows = seedMembers
      .map((s) => ({ ...this.toMemberRow({ ...s.member, householdId: rows.find((h) => h.household_code === s.houseKey)?.id ?? '' }) }))
      .filter((row) => row.household_id !== '');
    if (memberRows.length > 0) {
      const { error: mErr } = await this.client.from('members').insert(memberRows);
      if (mErr) { this.fail('สร้างรายชื่อตั้งต้นไม่สำเร็จ', mErr.message); return null; }
    }
    return rows.map((row) => this.toHousehold(row));
  }

  household(id: string | null): Household | undefined {
    return this.households().find((item) => item.id === id);
  }
  member(id: string | null): Member | undefined {
    return this.members().find((item) => item.id === id);
  }
  householdMembers(id: string): Member[] {
    return this.members().filter((item) => item.householdId === id);
  }

  async saveHousehold(value: { houseNumber: string; householdCode: string }, id?: string): Promise<string> {
    if (id) {
      const { error } = await this.client.from('households').update(this.toHouseRow(value)).eq('id', id);
      if (error) { this.fail('บันทึกครัวเรือนไม่สำเร็จ', error.message); return id; }
      this.households.update((items) => items.map((item) => item.id === id ? { ...item, ...value } : item));
      return id;
    }
    const { data, error } = await this.client.from('households').insert(this.toHouseRow(value)).select().single();
    if (error || !data) { this.fail('เพิ่มครัวเรือนไม่สำเร็จ', error?.message ?? ''); return ''; }
    const house = this.toHousehold(data as HouseholdRow);
    this.households.update((items) => [...items, house]);
    return house.id;
  }

  async removeHousehold(id: string): Promise<void> {
    const { error } = await this.client.from('households').delete().eq('id', id);
    if (error) { this.fail('ลบครัวเรือนไม่สำเร็จ', error.message); return; }
    this.households.update((items) => items.filter((item) => item.id !== id));
    this.members.update((items) => items.filter((item) => item.householdId !== id));
  }

  async saveMember(value: Omit<Member, 'id'>, id?: string): Promise<string> {
    if (id) {
      const { error } = await this.client.from('members').update(this.toMemberRow(value)).eq('id', id);
      if (error) { this.fail('บันทึกสมาชิกไม่สำเร็จ', error.message); return id; }
      this.members.update((items) => items.map((item) => item.id === id ? { ...item, ...value } : item));
      return id;
    }
    const { data, error } = await this.client.from('members').insert(this.toMemberRow(value)).select().single();
    if (error || !data) { this.fail('เพิ่มสมาชิกไม่สำเร็จ', error?.message ?? ''); return ''; }
    const member = this.toMember(data as MemberRow);
    this.members.update((items) => [...items, member]);
    return member.id;
  }

  async removeMember(id: string): Promise<void> {
    const { error } = await this.client.from('members').delete().eq('id', id);
    if (error) { this.fail('ลบสมาชิกไม่สำเร็จ', error.message); return; }
    this.members.update((items) => items.filter((item) => item.id !== id));
  }
}

