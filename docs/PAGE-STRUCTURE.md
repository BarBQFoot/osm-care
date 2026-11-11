# My OSM — Page Structure

## App Shell

- Sidebar: Dashboard, ครัวเรือน, พิมพ์เอกสาร, ตั้งค่า
- Header: ชื่อหน้าปัจจุบัน, breadcrumb ตามบริบท, action หลัก
- Main content: page title, เนื้อหา, responsive container
- Mobile: navigation drawer และ header ที่ไม่บังเนื้อหา

## 1. Dashboard — `/dashboard`

- หัวข้อ “ภาพรวม” และคำอธิบายสั้น
- Summary cards: จำนวนครัวเรือน, จำนวนสมาชิก (ค่าจากข้อมูลที่แอปมี)
- ทางลัด: เพิ่มครัวเรือน, ดูครัวเรือน, พิมพ์เอกสาร
- Empty state เมื่อยังไม่มีข้อมูล พร้อม CTA เพิ่มครัวเรือน
- ไม่แสดงกราฟหรือกิจกรรมที่ต้องพึ่งข้อมูลนอก scope

## 2. Households List — `/households`

- หัวข้อ “ครัวเรือน” และปุ่ม “เพิ่มครัวเรือน”
- ช่องค้นหาบ้านเลขที่/รหัสครัวเรือน
- Filter: แสดงทั้งหมด; หากมีตัวกรองสถานะ ต้องนิยามสถานะใน scope ก่อนใช้
- Desktop table: บ้านเลขที่, รหัสครัวเรือน, จำนวนสมาชิก, การกระทำ
- Mobile: household cards ที่กดเปิดรายละเอียดได้
- Empty/no results state แยกจากกัน; action ดู/แก้ไข/ลบตามบริบท

## 3. Household Detail — `/households/:householdId`

- Breadcrumb: ครัวเรือน > บ้านเลขที่
- Summary card: บ้านเลขที่, รหัสครัวเรือน
- รายชื่อสมาชิก: ชื่อ-นามสกุล, ความสัมพันธ์กับหัวหน้าครัวเรือน (ถ้ามี), ช่องทางเปิดรายละเอียด
- Actions: แก้ไขครัวเรือน, เพิ่มสมาชิก, ลบครัวเรือน (มี confirmation)
- Empty state สำหรับบ้านที่ยังไม่มีสมาชิก

## 4. Add/Edit Household — `/households/new`, `/households/:householdId/edit`

- ฟิลด์: บ้านเลขที่, รหัสครัวเรือน
- ปุ่มบันทึกและยกเลิก; validation และ error summary ตามความเหมาะสม
- โหมดเดียวใช้ component เดียวกันโดยรับค่าเริ่มต้น/สถานะ create หรือ edit

## 5. Member Detail — `/households/:householdId/members/:memberId`

- Breadcrumb: ครัวเรือน > บ้านเลขที่ > ชื่อสมาชิก
- สรุปข้อมูลบุคคลและข้อมูลติดต่อแบบแบ่งกลุ่ม
- แสดงบ้านที่สังกัดโดยอ้างอิงข้อมูล Household (ไม่ทำสำเนาฟิลด์บ้านใน Member)
- Actions: แก้ไขสมาชิก, ลบสมาชิก (มี confirmation), กลับครัวเรือน

## 6. Add/Edit Member — `/households/:householdId/members/new`, `/households/:householdId/members/:memberId/edit`

- แสดงบริบทครัวเรือนด้านบนแบบอ่านอย่างเดียว
- กลุ่ม “ข้อมูลบุคคล” และ “ข้อมูลติดต่อ” ตามรายการฟิลด์ใน `FRONTEND-PLAN.md`
- บันทึก/ยกเลิก และ inline validation
- householdId เป็นบริบท route ไม่ใช่ช่องให้กรอกซ้ำในแบบฟอร์ม

## 7. Print Documents — `/print`

- หัวข้อ “พิมพ์เอกสาร” และคำแนะนำก่อนพิมพ์
- เลือกเนื้อหาในขอบเขต: รายการครัวเรือนและสมาชิก หรือรายละเอียดของครัวเรือนที่เลือก
- ตัวเลือกการเรียง/ขอบเขตแสดงเฉพาะเมื่อจำเป็นต่อเอกสาร; ไม่สร้างชนิดเอกสารเฉพาะที่ผู้ใช้ไม่ได้กำหนด
- Preview A4, ปุ่มพิมพ์ และปุ่มกลับ
- Print view ซ่อน shell และแสดงหัวข้อ/วันที่พิมพ์ตามความจำเป็น

## 8. Settings — `/settings`

- การตั้งค่าการแสดงผลที่จำเป็น เช่น รูปแบบวันที่ (ถ้ามีตัวเลือก) และข้อมูลผู้ใช้สำหรับแสดงใน UI (ถ้ามี)
- ข้อความอธิบายขอบเขตชัดเจน; ไม่แสดงการเชื่อมต่อระบบ, บัญชีผู้ใช้, export/backup หรือ integration ที่อยู่นอก scope
- ค่าที่ไม่มีข้อกำหนดยืนยันให้เริ่มจากหน้าวางโครงหรือไม่แสดง control ที่ยังไม่มีพฤติกรรม

## Shared page states

- Loading, empty, no search results, validation error, not found, generic error
- Confirmation dialog ก่อนลบ Household/Member
- ทุกหน้าแสดง focus และ heading hierarchy ที่ถูกต้อง
