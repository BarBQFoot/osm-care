# My OSM — Frontend Development Plan

## เป้าหมาย

วางแผนส่วนติดต่อผู้ใช้สำหรับ อสม. 1 คน ดูแลประมาณ 10 ครัวเรือน และสมาชิกของแต่ละครัวเรือน ใช้งานภาษาไทยเป็นหลักบน Desktop, Tablet และ Mobile โดยใช้ Angular, TypeScript และ Tailwind CSS

## ขอบเขต

### รวมในแผน

- Dashboard สรุปจำนวนครัวเรือนและสมาชิก พร้อมทางลัดไปยังงานหลัก
- ค้นหาและกรองรายการครัวเรือน
- ดูรายละเอียดครัวเรือนและสมาชิก
- เพิ่ม/แก้ไขครัวเรือน และเพิ่ม/แก้ไขสมาชิก
- หน้าจัดเตรียมเอกสารและสั่งพิมพ์รูปแบบ A4
- ตั้งค่าการแสดงผลและข้อมูลผู้ใช้ที่จำเป็นต่อการแสดงผลในแอป
- การยืนยันก่อนลบ และสถานะว่าง/ผิดพลาด/กำลังโหลดของหน้าจอ

### ไม่รวมในขั้นตอนนี้

- Backend, Database, API, Authentication และการซิงก์ข้อมูล
- การกำหนดวิธีจัดเก็บจริงหรือการสำรองข้อมูล
- ฟีเจอร์นอกหน้าที่ระบุ เช่น แผนที่ การแจ้งเตือน รายงานสุขภาพ หรือการติดตามงาน

ข้อมูลในแผนเป็นข้อกำหนด UI และแบบจำลองฝั่ง Frontend เท่านั้น ไม่ใช่ข้อสรุปด้านกฎหมายหรือการจัดเก็บข้อมูลจริง

## หลักการออกแบบ

1. **งานประจำต้องเข้าถึงเร็ว** — เมนูหลักชัดเจน ค้นหาครัวเรือนได้จากหน้า List และเห็นการกระทำหลักในตำแหน่งสม่ำเสมอ
2. **แยกข้อมูลคนกับครัวเรือน** — บ้านเลขที่/รหัสครัวเรือนอยู่ใน Household; ข้อมูลระบุตัวตนและติดต่ออยู่ใน Member
3. **ใช้ภาษาและรูปแบบไทย** — ป้ายกำกับภาษาไทย วันที่แสดง พ.ศ. ใน UI (เก็บ/ประมวลผลตามข้อกำหนดของแอปภายหลัง) และฟอร์มตัวเลขที่อ่านง่าย
4. **ลดความผิดพลาด** — ตรวจฟิลด์ที่ต้องกรอกและรูปแบบข้อมูล แสดงข้อผิดพลาดข้างฟิลด์ และถามยืนยันก่อนลบ
5. **Responsive และเข้าถึงได้** — รองรับคีย์บอร์ด, focus ที่มองเห็น, label ชัดเจน, contrast อ่านได้ และไม่พึ่งสีอย่างเดียว

## โครงสร้างแอปที่เสนอ

- Angular แบบ standalone components และ Angular Router
- `AppShell` ครอบหน้าภายในด้วย Sidebar บนจอใหญ่ และเมนูแบบ drawer บนจอเล็ก
- แบ่ง `core` (shell, navigation, shared services แบบ UI), `shared` (ฟอร์มคอนโทรล/ไดอะล็อก/ตาราง) และ `features` ตามหน้า
- Typed interfaces สำหรับ `Household` และ `Member`; ความสัมพันธ์หน้าจอ: หนึ่ง Household มี Members หลายคน
- ใช้ reactive forms สำหรับ Add/Edit เพื่อควบคุม validation และสถานะฟอร์ม
- ข้อมูลตัวอย่าง/การเก็บข้อมูลชั่วคราวใช้เพื่อทำ UI prototype เท่านั้น จนกว่าจะมีข้อกำหนด persistence ในระยะถัดไป
- Tailwind CSS ใช้ utility classes และ design tokens กลางตาม `UI-DESIGN.md`

## Routing

| Route | หน้า | หมายเหตุ |
|---|---|---|
| `/dashboard` | Dashboard | หน้าเริ่มต้น |
| `/households` | Households List | search/filter และรายการ |
| `/households/new` | Add Household | ฟอร์มสร้าง |
| `/households/:householdId` | Household Detail | สรุปบ้านและสมาชิก |
| `/households/:householdId/edit` | Edit Household | แก้ข้อมูลครัวเรือน |
| `/households/:householdId/members/new` | Add Member | เพิ่มสมาชิกในบ้านนั้น |
| `/households/:householdId/members/:memberId` | Member Detail | รายละเอียดสมาชิก |
| `/households/:householdId/members/:memberId/edit` | Edit Member | แก้ข้อมูลสมาชิก |
| `/print` | Print Documents | เลือกเนื้อหา/รูปแบบและพิมพ์ |
| `/settings` | Settings | ตั้งค่าภายในขอบเขต |
| `**` | Not Found | ลิงก์กลับ Dashboard |

## Milestones

### M1 — Foundation และ Design System

- ยืนยันโครงสร้าง Angular, route map, shell และ responsive breakpoints
- กำหนดสี, typography, spacing, component states และแนวทาง accessibility
- ผลลัพธ์: AppShell, navigation, page container, button/input/card/dialog primitives
- เกณฑ์รับงาน: ทุกหน้ามีโครงร่าง responsive และเมนูนำทางทำงานได้

### M2 — ครัวเรือน

- สร้าง Household List, search/filter, detail และ Add/Edit form
- กำหนด validation สำหรับบ้านเลขที่และรหัสครัวเรือน พร้อม dialog ก่อนลบ
- เกณฑ์รับงาน: ไปมาระหว่าง List/Detail/Form ได้ และเห็นสถานะว่าง/validation

### M3 — สมาชิก

- สร้าง Member Detail และ Add/Edit form ที่แยกจาก Household
- เชื่อมบริบทสมาชิกกับ household route และแสดง breadcrumb/ข้อมูลบ้านแม่
- เกณฑ์รับงาน: ฟอร์มสมาชิกแสดงเฉพาะข้อมูลบุคคล และระบุครัวเรือนที่สังกัดชัดเจน

### M4 — Dashboard, Print และ Settings

- เติม Dashboard summary, หน้า Print A4 และ Settings ตามขอบเขต
- กำหนด print stylesheet ซ่อน navigation/actions และจัดหน้ากระดาษ
- เกณฑ์รับงาน: หน้า Print พิมพ์ได้โดยไม่ติดองค์ประกอบแอป และ Settings ไม่เพิ่มงานนอก scope

### M5 — Polish และ Responsive Review

- ทบทวนทุก route ที่ขนาด Mobile/Tablet/Desktop, keyboard flow, empty/error states และข้อความไทย
- ตรวจความสม่ำเสมอของ spacing, labels, confirmation และ print preview
- เกณฑ์รับงาน: เส้นทางหลักทำงานครบและไม่มีจุดที่ล้นจอ/การกระทำสำคัญหาไม่พบ

## Acceptance Criteria รวม

- มีครบ 8 หน้าใน scope และ route ตามเอกสารนี้
- ทุกหน้าภายในใช้ navigation และ visual language ร่วมกัน
- ข้อมูล Household และ Member แยกกันชัดเจนในโมเดลและฟอร์ม
- ค้นหา/กรองรายการ และยืนยันก่อนลบมีอยู่ใน UI
- รองรับ viewport มือถือ แท็บเล็ต และเดสก์ท็อป และพิมพ์เอกสาร A4 ได้
- ไม่มีการเรียก API หรือผูกฐานข้อมูลในงานวางแผนนี้

## ความเสี่ยง/ข้อสมมติ

- รายการฟิลด์สมาชิกด้านล่างเป็นข้อเสนอสำหรับหน้าจอจัดเก็บข้อมูลพื้นฐาน ควรยืนยันความจำเป็นและสิทธิ์เข้าถึงก่อนใช้งานกับข้อมูลจริง
- รูปแบบรหัสครัวเรือน, วิธีค้นหาที่อนุญาต, ชุดเอกสารที่ต้องพิมพ์ และฟิลด์ตั้งค่ายังไม่มีรายละเอียด จึงกำหนด UI แบบยืดหยุ่นโดยไม่สมมติ workflow เพิ่ม
- จำนวนผู้ใช้และครัวเรือนขนาดเล็กทำให้เน้นความเรียบง่าย มากกว่าการออกแบบระบบปฏิบัติการหลายบทบาท
