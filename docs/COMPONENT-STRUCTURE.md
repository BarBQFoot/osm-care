# My OSM — Component และ Routing Structure

โครงสร้างนี้เป็นข้อเสนอสำหรับ Angular standalone components แบ่งตาม feature เพื่อให้เข้าใจง่ายและขยายได้โดยไม่สร้าง abstraction เกินความจำเป็น

```text
src/app/
  core/
    layout/
      app-shell/
      sidebar-navigation/
      mobile-navigation-drawer/
      page-header/
      breadcrumb/
    dialogs/
      confirm-dialog/
    services/
      dialog.service.ts
  shared/
    ui/
      button/
      card/
      form-field/
      text-input/
      select-input/
      empty-state/
      loading-state/
      status-message/
    pipes/
      thai-date.pipe.ts
  features/
    dashboard/
      dashboard-page/
      summary-card/
    households/
      household-list-page/
      household-list-toolbar/
      household-table/
      household-card/
      household-detail-page/
      household-form-page/
      household-form/
    members/
      member-detail-page/
      member-form-page/
      member-form/
      member-summary/
    print/
      print-page/
      print-preview/
      print-document/
    settings/
      settings-page/
  models/
    household.model.ts
    member.model.ts
  app.routes.ts
  app.config.ts
```

## ขอบเขตความรับผิดชอบ

- `AppShell`: layout, sidebar/drawer, outlet; ไม่เก็บ logic ของข้อมูลครัวเรือน
- `PageHeader`/`Breadcrumb`: ชื่อหน้าและเส้นทางย้อนกลับที่สอดคล้องกัน
- `ConfirmDialog`: รับหัวข้อ/คำอธิบาย/ป้ายปุ่ม; destructive action ต้องแสดงชนิดรายการและค่าที่เกี่ยวข้อง
- `HouseholdListToolbar`: search และ filter ที่ผูกกับรายการบนหน้า
- `HouseholdForm`: รับ `FormGroup`/โหมด; มีเฉพาะ `houseNumber` และ `householdCode`
- `MemberForm`: รับบริบท household แบบอ่านอย่างเดียว; มีเฉพาะข้อมูลสมาชิก
- `PrintDocument`: markup เฉพาะเอกสาร ไม่มี navigation หรือปุ่มใน print output
- Shared UI component ต้องมี label, keyboard/focus state และรองรับ content ภาษาไทย

## Models ฝั่ง UI

```ts
interface Household {
  id: string;
  houseNumber: string;
  householdCode: string;
}

interface Member {
  id: string;
  householdId: string;
  title?: string;
  firstName: string;
  lastName: string;
  nationalId?: string;
  dateOfBirth?: string; // รูปแบบวันที่ภายในที่เลือกให้สม่ำเสมอ
  gender?: 'female' | 'male' | 'other' | 'unspecified';
  relationshipToHouseholdHead?: string;
  phone?: string;
  occupation?: string;
}
```

ฟิลด์ Member เป็นข้อเสนอ UI เบื้องต้น ไม่ใช่ข้อบังคับด้านทะเบียนหรือข้อยืนยันว่าทุกฟิลด์จำเป็น ควรจำกัดฟิลด์ให้ตรงกับงานจริงก่อนเก็บข้อมูลประชาชน โดยเฉพาะเลขประจำตัวประชาชนและข้อมูลอ่อนไหว; แสดงเฉพาะเมื่อมีเหตุผลและข้อกำหนดที่ชัดเจน

## Routing Configuration

```ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '', component: AppShellComponent, children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'households', component: HouseholdListPageComponent },
      { path: 'households/new', component: HouseholdFormPageComponent },
      { path: 'households/:householdId', component: HouseholdDetailPageComponent },
      { path: 'households/:householdId/edit', component: HouseholdFormPageComponent },
      { path: 'households/:householdId/members/new', component: MemberFormPageComponent },
      { path: 'households/:householdId/members/:memberId', component: MemberDetailPageComponent },
      { path: 'households/:householdId/members/:memberId/edit', component: MemberFormPageComponent },
      { path: 'print', component: PrintPageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];
```

ลำดับ route แบบ static (`new`) มาก่อน route parameter เพื่อหลีกเลี่ยงการตีความผิดเป็น ID; ตรวจ route parameters และแสดง not-found state เมื่อไม่พบข้อมูล

## Tailwind และ Styling

- ใช้ utility classes ใน template และ CSS theme tokens กลางจาก `UI-DESIGN.md`
- สร้าง component เมื่อมีพฤติกรรมหรือรูปแบบซ้ำ; ไม่ห่อ element ทุกชิ้นเป็น component
- ใช้ CSS เฉพาะ print ใน feature print หรือ global print layer ตามความเหมาะสม
- ไม่เพิ่ม UI library ในแผน เพื่อคง dependency ปัจจุบันและใช้ Tailwind ตามที่กำหนด
