# My OSM — UI Design System

## ทิศทางภาพรวม

Modern Minimal, สะอาด เป็นมืออาชีพ และอ่านง่าย ใช้พื้นหลังโทนอ่อน การ์ดเรียบ เส้นแบ่งบาง และสีเน้นเพียงสีเดียว เนื้อหาเป็นภาษาไทย ใช้คำสั้นและเข้าใจตรงกัน

## สี

| Token | สี | ใช้กับ |
|---|---|---|
| `brand-700` | `#166534` | ปุ่มหลัก, active navigation, ลิงก์สำคัญ |
| `brand-600` | `#15803D` | hover/focus accent |
| `brand-50` | `#F0FDF4` | พื้นหลังสถานะ/เมนู active แบบอ่อน |
| `ink-900` | `#17211B` | หัวข้อหลัก |
| `ink-700` | `#34443A` | เนื้อหาหลัก |
| `ink-500` | `#66736A` | คำอธิบาย/metadata |
| `surface` | `#FFFFFF` | การ์ดและแผง |
| `canvas` | `#F7F9F7` | พื้นหลังแอป |
| `line` | `#E3E9E4` | เส้นขอบและ divider |
| `danger-700` | `#B42318` | ลบ/ข้อผิดพลาด |
| `warning-700` | `#A15C00` | คำเตือน |

สีสถานะต้องมีข้อความหรือไอคอนกำกับ ไม่ใช้สีเป็นตัวสื่อความหมายเพียงอย่างเดียว ตรวจ contrast ใน implementation ก่อนส่งมอบ

## Typography และภาษา

- ฟอนต์หลัก: `Noto Sans Thai`, fallback `Tahoma`, `sans-serif`
- Body 16px / line-height 1.5; secondary 14px; label 14px medium
- Page title 24–28px; section title 18–20px; card metric 28–32px
- ใช้รูปแบบตัวเลขไทย/อารบิกอย่างสม่ำเสมอ; ค่าเริ่มต้นแนะนำเลขอารบิกเพื่อค้นหาและกรอกสะดวก
- วันที่ในหน้าจอแสดงรูปแบบไทยและ พ.ศ.; การแปลงรูปแบบต้องไม่เปลี่ยนค่าฟอร์มโดยไม่ตั้งใจ

## Layout และ responsive

- Desktop (`lg` ขึ้นไป): Sidebar กว้างประมาณ 248px, content max-width 1200px, มี top bar สำหรับชื่อหน้า/การกระทำ
- Tablet: Sidebar ย่อหรือเปิด/ปิดได้; ตารางเปลี่ยนเป็นแถวที่อ่านบนจอแคบได้
- Mobile: Sidebar เป็น drawer, top bar กระชับ, ปุ่ม action หลักเต็มความกว้างเมื่อเหมาะสม, ฟอร์มหนึ่งคอลัมน์
- ใช้ spacing scale 4/8/12/16/24/32px; card radius 12px; input/button radius 8px
- พื้นที่กดเป้าหมายอย่างน้อย 44px และมี focus ring ชัดเจน

## Component states

- ปุ่ม: default, hover, focus-visible, disabled, loading
- Input/select: default, focus, error, disabled; error text อยู่ใต้ฟิลด์
- รายการ: loading skeleton, populated, empty, error/retry
- Dialog: title, ผลของการกระทำ, secondary cancel และ destructive confirm
- Navigation: active state ใช้พื้นหลัง brand tint พร้อม aria-current

## หลักการฟอร์ม

- label อยู่เหนือ control ไม่ใช้ placeholder แทน label
- แสดง `จำเป็น` เฉพาะฟิลด์ที่ต้องกรอก; อธิบายรูปแบบตัวอย่างเมื่อข้อมูลอาจกำกวม
- validation ทำทั้งขณะ blur และเมื่อ submit; ข้อความภาษาไทยระบุวิธีแก้
- จัดกลุ่มข้อมูลบุคคลและส่วนติดต่อ; ไม่ปะปนฟิลด์ครัวเรือนในฟอร์มสมาชิก
- ปุ่มบันทึก/ยกเลิกอยู่ตำแหน่งคงที่; แจ้ง unsaved changes เมื่อออกจากฟอร์มได้ในระยะ implementation

## Search, filter และลบ

- Search มี label/คำใบ้ “ค้นหาบ้านเลขที่หรือรหัสครัวเรือน” และปุ่มล้างค่า
- Filter ที่แสดงต้องตรงกับข้อมูลที่มีจริง หลีกเลี่ยงตัวกรองที่ไม่มีเกณฑ์ข้อมูลรองรับ
- Dialog ลบแสดงสิ่งที่จะถูกลบ (บ้านหรือสมาชิก) และชื่อ/รหัสที่เกี่ยวข้อง; ต้องเลือกยืนยันอย่างชัดเจน

## Print A4

- หน้าพิมพ์มี preview ของข้อมูลที่เลือกพิมพ์และปุ่ม “พิมพ์เอกสาร”
- Print CSS: A4 portrait เป็นค่าเริ่มต้น, margin 12–15mm, พื้นหลังขาว, ซ่อน sidebar/topbar/buttons, ป้องกันหัวข้อ/แถวสำคัญแตกข้ามหน้า
- ตรวจการตัดคำภาษาไทยและระยะขอบด้วย browser print preview; ไม่ใส่ข้อมูลที่ไม่จำเป็นลงเอกสาร

## Tailwind implementation notes

- กำหนด token ใน theme ของ Tailwind CSS v4 (`@theme`) และใช้ utility classes ตาม token
- สร้าง shared primitives สำหรับ Button, FormField, Card, Badge, Dialog และ PageHeader
- หลีกเลี่ยง arbitrary values ซ้ำ ๆ; ใช้ token หรือ component class เมื่อรูปแบบเกิดซ้ำ
- แยก print rules ไว้ใน stylesheet ที่อ่านง่าย และตรวจว่า Tailwind content scan ครอบคลุม template Angular
