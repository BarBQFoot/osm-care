# My OSM — Component Design

## App Shell และเมนู

`AppShell`

- Desktop/Tablet แสดง Sidebar คงที่; Mobile แสดงปุ่ม “เมนู” ที่มีขนาดกดใหญ่และเปิด drawer
- เมนูหลัก 4 รายการระดับเดียว: “หน้าหลัก”, “ครัวเรือน”, “พิมพ์เอกสาร”, “ตั้งค่า”
- มีข้อความและไอคอนกำกับทุกเมนู; active item ระบุด้วยข้อความ/marker และ `aria-current="page"`
- ทุกหน้ารองมีปุ่มกลับที่มองเห็นได้ ไม่บังคับให้ผู้ใช้จำวิธีปัด

## Reusable components

| Component | หน้าที่ | ข้อกำหนด |
|---|---|---|
| `PageHeader` | ชื่อหน้า คำอธิบาย ปุ่มกลับ/การกระทำหลัก | H1 เดียวต่อหน้า; action ชื่อชัด |
| `PrimaryButton` | บันทึก/เพิ่ม/พิมพ์ | สูง ≥60px, icon + text, disabled/loading |
| `SecondaryButton` | กลับ/ยกเลิก | สูง ≥56px, contrast/border ชัด |
| `DestructiveButton` | ลบข้อมูล | แยกตำแหน่งจากบันทึก; เปิด confirm |
| `FormField` | Label, control, helper, error | สูง ≥60px, label จริง, `aria-describedby` |
| `SearchField` | ค้นหาบ้านเลขที่/รหัส | สูง ≥60px; ล้างคำค้นด้วยปุ่มที่มี label |
| `HouseholdListItem` | สรุปครัวเรือนใน list | บ้านเลขที่, รหัส, จำนวนสมาชิก; target ≥56px |
| `MemberListItem` | สรุปสมาชิกในบ้าน | ชื่อเต็ม, ความสัมพันธ์; target ≥56px |
| `ConfirmDialog` | ยืนยันลบ/ออกโดยไม่บันทึก | focus เข้า dialog, ยกเลิกเป็นทางปลอดภัย, คืน focus หลังปิด |
| `FeedbackMessage` | แจ้งบันทึกสำเร็จ/ข้อผิดพลาด | `role=status`/`alert` ตามความเร่งด่วน |
| `EmptyState` | บอกเหตุผลและขั้นตอนต่อไป | มีข้อความและ CTA ที่ตรงกับบริบท |
| `PrintPreview` | preview เอกสาร A4 | พิมพ์เฉพาะเนื้อหาเอกสาร; ซ่อน shell ใน print |

## Page composition

- Dashboard: `PageHeader` + ปุ่มค้นหา/เพิ่ม + summary + รายการครัวเรือนล่าสุด
- Household List: `PageHeader` + `SearchField` + `HouseholdListItem` + `EmptyState`
- Household Detail: `PageHeader`/กลับ + household summary + member list + ปุ่มเพิ่ม/แก้ไข/ลบ
- Household Form: `FormSection` บ้านเลขที่และรหัส + action row
- Member Detail: กลับบ้าน + ส่วนข้อมูลบุคคล/ติดต่อ + แก้ไข/ลบ
- Member Form: household context แบบอ่านอย่างเดียว + sections ข้อมูลบุคคล/ติดต่อ + action row
- Print: ตัวเลือกขอบเขต + preview + ปุ่มพิมพ์
- Settings: ชื่อผู้ดูแล/รูปแบบวันที่ที่ระบุชัดและมี feedback

## Form behavior

- Household: บ้านเลขที่และรหัสครัวเรือน; required/error message ภาษาไทย
- Member: ชื่อและนามสกุลจำเป็น; วันเกิดเลือกผ่าน native date picker หรือ custom picker ที่มีปุ่มก่อน/ถัดไปขนาดใหญ่และพิมพ์ค่าได้
- ไม่วางฟิลด์ Household ใน Member Form; รหัสบ้านแสดงเป็นบริบทอ่านอย่างเดียว
- ปุ่มบันทึกมี `type="submit"`; ระหว่าง submit ป้องกันส่งซ้ำและแจ้ง “กำลังบันทึกข้อมูล…”
- เมื่อบันทึกสำเร็จ แสดงข้อความยืนยันและพาไปหน้า Detail; เมื่อยกเลิกหลังแก้ค่าให้ถามก่อนออก

## Delete dialog copy

- สมาชิก: “ต้องการลบข้อมูลของ [ชื่อสมาชิก] หรือไม่? เมื่อลบแล้ว รายชื่อนี้จะไม่อยู่ในครัวเรือน”
- ครัวเรือนมีสมาชิก: ระบุจำนวนสมาชิกและผลที่แน่ชัด; ห้ามลบข้อมูลสมาชิกต่อเนื่องโดยไม่มีคำเตือนเฉพาะ
- ปุ่มเรียง: “ยกเลิก” ก่อน “ยืนยันการลบ”; สีและคำยืนยันสอดคล้องกัน

## Angular structure proposal

```text
src/app/
  core/layout/                 # app shell, sidebar, mobile menu
  shared/ui/                   # buttons, field, dialog, empty state, feedback
  features/dashboard/
  features/households/         # list, detail, form
  features/members/             # detail, form
  features/print/
  features/settings/
```

แต่ละ route page มี `.ts` และ `.html` แยกกัน; shared component รับ input/output แบบ typed. หลีกเลี่ยง template ซ้ำและไม่ทำ component แยกทุก element จนอ่านยาก
