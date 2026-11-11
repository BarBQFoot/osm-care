import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard-page';
import { HouseholdDetailPage } from './features/households/household-detail-page';
import { HouseholdFormPage } from './features/households/household-form-page';
import { HouseholdListPage } from './features/households/household-list-page';
import { MemberDetailPage } from './features/members/member-detail-page';
import { MemberFormPage } from './features/members/member-form-page';
import { PrintPage } from './features/print/print-page';
import { SettingsPage } from './features/settings/settings-page';
import { NotFoundPage } from './shared/not-found-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPage, title: 'ภาพรวม | My OSM' },
  { path: 'households', component: HouseholdListPage, title: 'ครัวเรือน | My OSM' },
  { path: 'households/new', component: HouseholdFormPage, title: 'เพิ่มครัวเรือน | My OSM' },
  { path: 'households/:householdId/edit', component: HouseholdFormPage, title: 'แก้ไขครัวเรือน | My OSM' },
  { path: 'households/:householdId/members/new', component: MemberFormPage, title: 'เพิ่มสมาชิก | My OSM' },
  { path: 'households/:householdId/members/:memberId/edit', component: MemberFormPage, title: 'แก้ไขสมาชิก | My OSM' },
  { path: 'households/:householdId/members/:memberId', component: MemberDetailPage, title: 'ข้อมูลสมาชิก | My OSM' },
  { path: 'households/:householdId', component: HouseholdDetailPage, title: 'รายละเอียดครัวเรือน | My OSM' },
  { path: 'print', component: PrintPage, title: 'พิมพ์เอกสาร | My OSM' },
  { path: 'settings', component: SettingsPage, title: 'ตั้งค่า | My OSM' },
  { path: '**', component: NotFoundPage, title: 'ไม่พบหน้า | My OSM' },
];
