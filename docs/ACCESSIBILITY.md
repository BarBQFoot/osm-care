# My OSM — Accessibility Requirements

เป้าหมายการออกแบบคือ WCAG 2.2 ระดับ AA และการใช้งานด้วยแป้นพิมพ์/โปรแกรมอ่านหน้าจอ ทั้งนี้ต้องตรวจจริงกับ UI ก่อนอ้างว่าผ่านมาตรฐาน

## การมองเห็นและการอ่าน

- body 18px เป็นค่าเริ่มต้น, helper text อย่างน้อย 16px; title 24–30px
- contrast ข้อความปกติ ≥4.5:1, ข้อความใหญ่และส่วนควบคุม ≥3:1
- ข้อผิดพลาด/สำเร็จมีข้อความหรือ icon พร้อมสี ไม่ใช้สีอย่างเดียว
- เมื่อ zoom 200% และ viewport 320 CSS px ไม่มีข้อความ/ปุ่มถูกตัดหรือมีการเลื่อนแนวนอนทั้งหน้า
- รองรับ `prefers-reduced-motion`; focus indicator มองเห็นได้และไม่ถูก sticky header บัง

## Keyboard และ Focus

- Tab เดินไปยังทุก action ตามลำดับภาพ; Shift+Tab ย้อนกลับ; Enter/Space เปิดปุ่ม/ลิงก์
- มี skip link “ข้ามไปเนื้อหาหลัก”
- Dialog ดัก focus ภายในขณะเปิด, Escape ปิดได้เมื่อปลอดภัย, ปิดแล้วคืน focus ไปปุ่มเดิม
- หลังบันทึก/ลบและ route change ให้ focus ไป heading หลักหรือประกาศสถานะอย่างเหมาะสม
- ปุ่มไอคอนล้วนต้องมี accessible name; ปุ่มทุกปุ่มมีข้อความกำกับไอคอนตามข้อกำหนดผลิตภัณฑ์

## Semantics และ Screen reader

- ใช้ `header`, `nav`, `main`, `footer`; nav มีชื่อ; H1 เดียวต่อหน้าและ heading เรียงลำดับ
- input ทุกช่องผูก `<label>`; error/helper เชื่อมด้วย `aria-describedby`; required ใช้ทั้งข้อความและ `required`
- ตารางมี caption และ header สำหรับ Desktop; mobile card ยังคงอ่านลำดับข้อมูลได้
- สถานะบันทึกใช้ `role="status" aria-live="polite"`; error สำคัญใช้ `role="alert"` อย่างพอดี
- เมนู mobile สื่อ expanded state ด้วย `aria-expanded` และเชื่อม panel ด้วย `aria-controls`

## Target size และระยะห่าง

- เป้าหมายปุ่มหลัก 56–64px สูง; ช่องกรอก ≥56px; อย่างต่ำไม่มี target ต่ำกว่า 44×44px
- เว้น target แยกกันอย่างน้อย 8px; ปุ่มลบห่างจากปุ่มบันทึกอย่างน้อย 16px
- ไม่สื่อความแตกต่างด้วย hover อย่างเดียว; ขอบ focus ใช้ได้กับ mouse และ keyboard

## Forms และ Error prevention

- มี label และตัวอย่างรูปแบบข้อมูล; validation ไม่ล้างค่าที่กรอก
- เมื่อ submit ไม่ผ่าน ให้ focus ช่องแรกที่ผิดและสรุปสิ่งที่ต้องแก้
- วันเกิดเลือกจาก date picker ที่เข้าถึงผ่าน keyboard ได้ และยังกรอกวันที่ด้วยแป้นพิมพ์ได้
- ป้องกัน double submit; แจ้งสถานะ loading; เตือนก่อนออกเมื่อมีการแก้ไขที่ยังไม่บันทึก
- confirm dialog อธิบายผลของ delete และวาง “ยกเลิก” เป็นทางเลือกที่ปลอดภัย

## Responsive และทดสอบ

- ทดสอบ Desktop, Tablet และ Mobile แนวตั้ง; ไม่พึ่ง gesture
- ตรวจ keyboard-only, screen reader อย่างน้อย NVDA หรือ Narrator, browser zoom 200%, contrast analyzer และ target size
- บันทึกปัญหาและระดับความรุนแรง; ห้ามอ้าง WCAG conformance จนผ่านการตรวจทุกข้อที่เกี่ยวข้อง
